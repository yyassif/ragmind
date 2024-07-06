import os
import random
import re
import string
from abc import abstractmethod
from io import BytesIO
from tempfile import NamedTemporaryFile
from typing import List

from fastapi import UploadFile
from pydantic import BaseModel
from ragmind_api.logger import get_logger
from ragmind_api.modules.assistant.dto.inputs import InputAssistant
from ragmind_api.modules.assistant.ito.utils.pdf_generator import PDFGenerator, PDFModel
from ragmind_api.modules.contact_support.controller.settings import ContactsSettings
from ragmind_api.modules.upload.controller.upload_routes import upload_file
from ragmind_api.modules.user.entity.user_identity import UserIdentity
from ragmind_api.packages.emails.send_email import send_email
from unidecode import unidecode

logger = get_logger(__name__)


class ITO(BaseModel):
    input: InputAssistant
    files: List[UploadFile]
    current_user: UserIdentity

    def __init__(
        self,
        input: InputAssistant,
        files: List[UploadFile] = None,
        current_user: UserIdentity = None,
        **kwargs,
    ):
        super().__init__(
            input=input,
            files=files,
            current_user=current_user,
            **kwargs,
        )

    def generate_pdf(self, filename: str, title: str, content: str):
        pdf_model = PDFModel(title=title, content=content)
        pdf = PDFGenerator(pdf_model)
        pdf.print_pdf()
        pdf.output(filename, "F")

    @abstractmethod
    async def process_assistant(self):
        pass

    async def send_output_by_email(
        self,
        file: UploadFile,
        filename: str,
        task_name: str,
        custom_message: str,
        brain_id: str = None,
    ):
        settings = ContactsSettings()
        file = await self.uploadfile_to_file(file)
        application_domain = os.getenv("APPLICATION_DOMAIN", "https://chat.yyassif.dev")

        with open(file.name, "rb") as f:
            mail_from = settings.resend_contact_sales_from
            mail_to = self.current_user.email
            body = f"""
            <div style="text-align: center;">
                <img src="https://ragmind.s3.eu-west-3.amazonaws.com/logo.png" alt="RAGMind Logo" style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto; display: block;">
                
                <p>RAGMind's ingestion process has been completed. The processed file is attached.</p>
                
                <p><strong>Task:</strong> {task_name}</p>
                
                <p><strong>Output:</strong> {custom_message}</p>
                <br />
                

            </div>
            """
            if brain_id:
                body += f"<div style='text-align: center;'>You can find the file <a href='{application_domain}/studio/{brain_id}'>here</a>.</div> <br />"
            body += f"""
            <div style="text-align: center;">
                <p>Please let us know if you have any questions or need further assistance.</p>
                
            </div>
            """
            params = {
                "from": mail_from,
                "to": [mail_to],
                "subject": "RAGMind Ingestion Processed",
                "reply_to": "no-reply@emails.dev",
                "html": body,
                "attachments": [{"filename": filename, "content": list(f.read())}],
            }
            logger.info(f"Sending email to {mail_to} with file {filename}")
            send_email(params)

    async def uploadfile_to_file(self, uploadFile: UploadFile):
        # Transform the UploadFile object to a file object with same name and content
        tmp_file = NamedTemporaryFile(delete=False)
        tmp_file.write(uploadFile.file.read())
        tmp_file.flush()  # Make sure all data is written to disk
        return tmp_file

    async def create_and_upload_processed_file(
        self, processed_content: str, original_filename: str, file_description: str
    ) -> dict:
        """Handles creation and uploading of the processed file."""
        # remove any special characters from the filename that aren't http safe

        new_filename = (
            original_filename.split(".")[0]
            + "_"
            + file_description.lower().replace(" ", "_")
            + "_"
            + str(random.randint(1000, 9999))
            + ".pdf"
        )
        new_filename = unidecode(new_filename)
        new_filename = re.sub(
            "[^{}0-9a-zA-Z]".format(re.escape(string.punctuation)), "", new_filename
        )

        self.generate_pdf(
            new_filename,
            f"{file_description} of {original_filename}",
            processed_content,
        )

        content_io = BytesIO()
        with open(new_filename, "rb") as f:
            content_io.write(f.read())
        content_io.seek(0)

        file_to_upload = UploadFile(
            filename=new_filename,
            file=content_io,
            headers={"content-type": "application/pdf"},
        )

        if self.input.outputs.email.activated:
            await self.send_output_by_email(
                file_to_upload,
                new_filename,
                "Summary",
                f"{file_description} of {original_filename}",
                brain_id=(
                    self.input.outputs.brain.value
                    if (
                        self.input.outputs.brain.activated
                        and self.input.outputs.brain.value
                    )
                    else None
                ),
            )

        # Reset to start of file before upload
        file_to_upload.file.seek(0)
        if self.input.outputs.brain.activated:
            await upload_file(
                uploadFile=file_to_upload,
                brain_id=self.input.outputs.brain.value,
                current_user=self.current_user,
                chat_id=None,
            )

        os.remove(new_filename)

        return {"message": f"{file_description} generated successfully"}
