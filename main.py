from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from fb import get_all_users, accept_form

app = FastAPI()


@app.get("/fb")
async def root():
    return get_all_users()


class Resp(BaseModel):
    uid: str
    message: str


@app.post("/fb")
async def send(resp: Resp):
    print(resp)
    return accept_form(uid=resp.uid, message=resp.message)
    # return send_message(uid=resp.uid, message=resp.message)


app.mount("/", StaticFiles(directory="static", html=True), name="static")

# if __name__ == "__main__":
#     app.run(debug=False,port=8000)