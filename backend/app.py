import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:*"}})

# Constants from notebook
FRESH_TO_DRY_RATIO = 0.1               # 10:1 fresh to dry
DRY_TO_CHLORO_RATIO = 1 / 20           # 20:1 dry to chlorophyll
C_PCT = 0.33
N_PCT = 0.025
P_PCT = 0.003

PRICE_C = 0.13    # per lb
PRICE_N = 5.08
PRICE_P = 11.15

# Load the trained model
with open('quantile_regressor_model.pkl', 'rb') as f:
    model = pickle.load(f)

def calculate_phyco_credits(dry_biomass_lb):
    c_lb = dry_biomass_lb * C_PCT
    n_lb = dry_biomass_lb * N_PCT
    p_lb = dry_biomass_lb * P_PCT

    value_c = c_lb * PRICE_C
    value_n = n_lb * PRICE_N
    value_p = p_lb * PRICE_P
    total_value = value_c + value_n + value_p

    return {
        'carbon_lb': c_lb,
        'nitrogen_lb': n_lb,
        'phosphorus_lb': p_lb,
        'value_c_usd': value_c,
        'value_n_usd': value_n,
        'value_p_usd': value_p,
        'total_usd': total_value
    }

def assess_biomass_feasibility(env_vars, reported_biomass_lb, is_dry_input):
    x = np.array(env_vars).reshape(1, -1)
    q95_chl = float(model.predict(x))

    # Convert to dry biomass (if needed)
    dry_biomass = reported_biomass_lb if is_dry_input else reported_biomass_lb * FRESH_TO_DRY_RATIO
    q95_dry = q95_chl / DRY_TO_CHLORO_RATIO  # upper bound dry biomass
    feasible = dry_biomass <= q95_dry
    ratio = dry_biomass / q95_dry

    credit_info = calculate_phyco_credits(dry_biomass)

    return {
        'feasible': feasible,
        'q95_chlorophyll': q95_chl,
        'q95_dry_biomass_lb': q95_dry,
        'reported_input_biomass_lb': reported_biomass_lb,
        'input_type': 'dry' if is_dry_input else 'fresh',
        'reported_dry_biomass_lb': dry_biomass,
        'ratio': ratio,
        **credit_info
    }

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Extract input data
    features = data.get('features')
    reported_biomass = data.get('reported_biomass_lb')
    is_dry_input = data.get('is_dry_input', False)  # defaults to fresh biomass
    
    if not features or len(features) != 5:
        return jsonify({'error': 'Please provide a list of 5 features.'}), 400
    if not reported_biomass:
        return jsonify({'error': 'Please provide reported_biomass_lb.'}), 400

    # Get feasibility report
    result = assess_biomass_feasibility(features, reported_biomass, is_dry_input)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000) 