import gspread
import pandas as pd
import json
from oauth2client.service_account import ServiceAccountCredentials

# ==== CONNECT TO GOOGLE SHEET ====

# Define the access scope for Google APIs, a scope tells you what user can or cannot do in your app, but not applicable to public API
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]

import os
# check if creds and python script is in the same file
print("Current Directory:", os.getcwd())
print("Files:", os.listdir())

creds = ServiceAccountCredentials.from_json_keyfile_name("creds.json", scope)
client = gspread.authorize(creds)

# Open your sheet by name or URL
sheet = client.open_by_url("https://docs.google.com/spreadsheets/d/11ZgCv9Lfh8YdNm6UAWQsBGjO8aE8wz1kTcHNmYya_vg/edit?gid=0#gid=0")

# get the first worksheet
worksheet = sheet.get_worksheet(0)

# read all record sinto a list of dictionaries
data = worksheet.get_all_records()

#print(type(data))

# convert list to a pandas dataframe
df = pd.DataFrame(data)

# convert date column to datetime format
df['date'] = pd.to_datetime(df['date'])

# print the first few rows
print(df.head())

# Choose activity
activity = 'coding'
df = df[['date', activity]].copy()
df.set_index('date', inplace=True)

# Fill in all days of the year
year = df.index.min().year
all_days = pd.date_range(start=f"{year}-06-01", end=f"{year}-12-31")
activity_series = df[activity].reindex(all_days, fill_value=0)

# === PREPARE JSON OUTPUT (day=0-6, week=0-52)
json_output = []

for d, value in activity_series.items():
    # Correct way to extract ISO week number
    week = d.isocalendar()[1]
    day = d.weekday()

    # Fix edge case where Jan 1–3 sometimes gets week 52/53 of previous year
    if d.month == 1 and week > 50:
        week = 0

    json_output.append({
        "day": day,
        "week": week,
        "value": int(value)
    })


# save to json file
with open("heatmap_data.json", "w") as f:
    json.dump(json_output, f, indent = 2)