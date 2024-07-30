import pandas as pd
from datetime import datetime

# Ruta del archivo CSV
csv_file_path = './data.csv'

# Ruta del archivo JSON
json_file_path = './data.json'

# Leer el archivo CSV
df = pd.read_csv(csv_file_path)

# Renombrar las columnas si es necesario
df.rename(columns={'nombre': 'name', 'valor': 'traffic_value', 'fecha': 'traffic_date'}, inplace=True)

# Convierte a JSON
df.to_json(json_file_path, orient='records', lines=True)
