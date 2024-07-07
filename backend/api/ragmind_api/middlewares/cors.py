from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://yyassif.dev",
    "https://yyasif.dev",
    "https://www.yyassif.dev",
    "http://yyassif.dev",
    "http://yyasif.dev",
    "http://www.yyassif.dev",
    "http://www.yyasif.dev",
    "https://chat.yyassif.dev",
    "https://chat.yyasif.dev",
    "https://ragmind.yyassif.dev",
    "https://ragmind.yyasif.dev",
]


def add_cors_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
