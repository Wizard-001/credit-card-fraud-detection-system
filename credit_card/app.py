from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from datetime import datetime

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

@app.get("/health", include_in_schema=False)
def health():
    return {"status": "Fraud Shield API is Running", "docs": "/docs"}

# Get absolute path to the directory containing this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model once on startup using absolute paths
model     = joblib.load(os.path.join(BASE_DIR, 'fraud_model.pkl'))
THRESHOLD = joblib.load(os.path.join(BASE_DIR, 'threshold.pkl'))
FEATURES  = joblib.load(os.path.join(BASE_DIR, 'feature_columns.pkl'))

STATE_POP = {
    "AL":48000,"AK":42000,"AZ":78000,"AR":42000,"CA":120000,"CO":76000,
    "CT":75000,"DE":60000,"FL":80000,"GA":75000,"HI":80000,"ID":45000,
    "IL":85000,"IN":58000,"IA":45000,"KS":48000,"KY":50000,"LA":55000,
    "ME":40000,"MD":82000,"MA":95000,"MI":68000,"MN":72000,"MS":40000,
    "MO":55000,"MT":38000,"NE":48000,"NV":70000,"NH":55000,"NJ":90000,
    "NM":50000,"NY":200000,"NC":70000,"ND":33000,"OH":65000,"OK":55000,
    "OR":70000,"PA":70000,"RI":65000,"SC":52000,"SD":35000,"TN":60000,
    "TX":95000,"UT":65000,"VT":35000,"VA":72000,"WA":88000,"WV":38000,
    "WI":60000,"WY":30000
}

STATE_COORDS = {
    "AL":(32.8,-86.8),"AK":(64.2,-153.4),"AZ":(34.3,-111.1),"AR":(34.8,-92.2),
    "CA":(36.8,-119.4),"CO":(39.0,-105.5),"CT":(41.6,-72.7),"DE":(39.0,-75.5),
    "FL":(27.8,-81.6),"GA":(32.2,-83.4),"HI":(20.8,-156.3),"ID":(44.4,-114.5),
    "IL":(40.0,-89.2),"IN":(39.9,-86.3),"IA":(42.1,-93.2),"KS":(38.5,-98.4),
    "KY":(37.5,-85.3),"LA":(31.2,-91.8),"ME":(45.4,-69.0),"MD":(39.0,-76.8),
    "MA":(42.3,-71.8),"MI":(44.3,-85.4),"MN":(46.4,-93.1),"MS":(32.7,-89.7),
    "MO":(38.5,-92.5),"MT":(47.0,-110.5),"NE":(41.5,-99.9),"NV":(39.3,-116.6),
    "NH":(43.7,-71.6),"NJ":(40.1,-74.5),"NM":(34.4,-106.1),"NY":(42.9,-75.5),
    "NC":(35.5,-79.4),"ND":(47.5,-100.5),"OH":(40.4,-82.8),"OK":(35.6,-96.9),
    "OR":(44.6,-122.1),"PA":(40.9,-77.8),"RI":(41.7,-71.5),"SC":(33.9,-80.9),
    "SD":(44.4,-100.2),"TN":(35.9,-86.4),"TX":(31.5,-99.3),"UT":(39.4,-111.1),
    "VT":(44.1,-72.7),"VA":(37.8,-78.2),"WA":(47.4,-120.6),"WV":(38.6,-80.6),
    "WI":(44.3,-89.6),"WY":(43.0,-107.6)
}

# Input schema
class Transaction(BaseModel):
    amt: float
    category: str
    hour: int
    age: int
    gender: str      
    cust_state: str    
    merch_state: str

@app.post("/predict")
def predict(tx: Transaction):
    # Feature engineering
    is_night  = 1 if (tx.hour >= 22 or tx.hour <= 3) else 0
    is_online = 1 if tx.category in ['shopping_net','misc_net','grocery_net'] else 0
    gender_enc= 1 if tx.gender == "M" else 0
    city_pop  = STATE_POP.get(tx.cust_state, 50000)
    c1        = STATE_COORDS.get(tx.cust_state, (39.0,-98.0))
    c2        = STATE_COORDS.get(tx.merch_state,(39.0,-98.0))
    distance  = ((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2)**0.5

    now = datetime.now()
    features = {
        'amt': tx.amt, 'city_pop': city_pop,
        'hour': tx.hour, 'day_of_week': now.weekday(),
        'month': now.month, 'is_night': is_night,
        'age': tx.age, 'distance': distance,
        'is_online': is_online, 'gender_enc': gender_enc,
    }

    all_cats = [
        'food_dining','gas_transport','grocery_net','grocery_pos',
        'health_fitness','home','kids_pets','misc_net','misc_pos',
        'personal_care','shopping_net','shopping_pos','travel'
    ]
    for cat in all_cats:
        features[f'category_{cat}'] = 1 if tx.category == cat else 0

    df = pd.DataFrame([features])
    for col in FEATURES:
        if col not in df.columns:
            df[col] = 0
    df = df[FEATURES]

    proba    = model.predict_proba(df)[0][1]
    is_fraud = bool(proba >= THRESHOLD)

    return {
        "is_fraud":        is_fraud,
        "fraud_probability": round(proba * 100, 1),
        "safe_probability":  round((1 - proba) * 100, 1),
        "threshold":         int(THRESHOLD * 100)
    }