from typing import Dict, Optional, Type

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.pydantic_v1 import BaseModel as BaseModelV1
from langchain.pydantic_v1 import Field as FieldV1
from langchain_core.tools import BaseTool
from pydantic import BaseModel
from ragmind_api.logger import get_logger
from ragmind_api.models.settings import BrainSettings
from ragmind_api.modules.contact_support.controller.settings import ContactsSettings
from ragmind_api.packages.emails.send_email import send_email

logger = get_logger(__name__)


class EmailInput(BaseModelV1):
    text: str = FieldV1(
        ...,
        title="text",
        description="text to send in HTML email format. Use pretty formating, use bold, italic, next line, etc...",
    )


class EmailSenderTool(BaseTool):
    user_email: str
    name = "email-sender"
    description = "useful for when you need to send an email."
    args_schema: Type[BaseModel] = EmailInput
    brain_settings: BrainSettings = BrainSettings()
    contact_settings: ContactsSettings = ContactsSettings()

    def _run(
        self, text: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> Dict:
        html_body = """
        <div style="text-align: center;">
                <img src="https://ragmind.s3.eu-west-3.amazonaws.com/logo.png" alt="RAGMind Logo" style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto; display: block;">
                <br />
            </div>
            """
        html_body += f"""
            {text}
            """
        logger.debug(f"Email body: {html_body}")
        logger.debug(f"Email to: {self.user_email}")
        logger.debug(f"Email from: {self.contact_settings.resend_contact_sales_from}")
        try:
            r = send_email(
                {
                    "from": self.contact_settings.resend_contact_sales_from,
                    "to": self.user_email,
                    "reply_to": "no-reply@emails.yyassif.dev",
                    "subject": "Email from your assistant",
                    "html": html_body,
                }
            )
            logger.info("Resend response", r)
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return {"content": "Error sending email because of error: " + str(e)}

        return {"content": "Email sent"}

    async def _arun(
        self, text: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> Dict:
        html_body = """
        <div style="text-align: center;">
                <img src="https://ragmind.s3.eu-west-3.amazonaws.com/logo.png" alt="RAGMind Logo" style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto; display: block;">
                <br />
            </div>
            """
        html_body += f"""
            {text}
            """
        logger.debug(f"Email body: {html_body}")
        logger.debug(f"Email to: {self.user_email}")
        logger.debug(f"Email from: {self.contact_settings.resend_contact_sales_from}")
        try:
            r = send_email(
                {
                    "from": self.contact_settings.resend_contact_sales_from,
                    "to": self.user_email,
                    "reply_to": "no-reply@emails.yyassif.dev",
                    "subject": "Email from your assistant",
                    "html": html_body,
                }
            )
            logger.info("Resend response", r)
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return {"content": "Error sending email because of error: " + str(e)}

        return {"content": "Email sent"}
