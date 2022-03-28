import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pandas as pd

# initializations
cred = credentials.Certificate("firebase-service.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


#
# doc_ref = db.collection('users').document('forms')


def get_all_users():
    emp_ref = db.collection('users')
    docs = emp_ref.stream()
    out = []
    for doc in docs:
        user_data = doc.to_dict()['userData']
        # print(user_data['uid'])
        cols = get_sub_collections(user_data['uid'])
        for col in cols:
            user_data.update(normalize_dict(col))
        out.append(user_data)
    return out


def get_sub_collections(doc_id):
    out = []
    collections = db.collection('users').document(doc_id).collections()
    for collection in collections:
        for doc in collection.stream():
            out.append(doc.to_dict())
    return out


# get_sub_collections()

def gov_message(doc_id, collection_name="govMessages"):
    doc_ref = db.collection(u'users').document(doc_id).collection(collection_name)
    doc = doc_ref.get()
    if doc:
        for i in doc_ref.stream():
            if i.to_dict()['message']:
                return i.to_dict()['message']
    else:
        print(u'No such document!', doc_id)
        return False


def normalize_dict(d):
    try:
        df = pd.json_normalize(d, sep='_')
        return df.to_dict(orient='records')[0]
    except Exception as e:
        return dict()


#
# for i in get_sub_collections():
#     print(normalize_dict(i))
#     print("   ----------------")
# print(gov_message())
# print(get_all_users())
def accept_form(uid, formId, message):
    try:
        doc_ref = db.collection(u'users').document(uid).collection("forms").document(formId)
        doc_ref.update({
            u'status': message
        })
    except Exception as e:
        print(e)
        return e


# def send_message(uid, message):
#     try:
#         doc_ref = db.collection(u'users').document(uid).collection("govMessages").document()
#         doc_ref.set({
#             u'message': message
#         })
#         return True
#     except Exception as e:
#         print(e)
#         return e
