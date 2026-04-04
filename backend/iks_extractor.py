def extract_iks_signals(report_text):
    text = report_text.lower()
    return {
        'animal_migration': any(w in text for w in [
            'animal', 'migration', 'elephant', 'deer',
            'birds leaving', 'animals moving'
        ]),
        'river_color_change': any(w in text for w in [
            'river', 'water color', 'stream', 'brown water',
            'muddy water', 'water changed'
        ]),
        'plant_anomaly': any(w in text for w in [
            'flowering', 'out of season', 'early bloom',
            'leaves falling', 'trees dying'
        ]),
        'dry_streams': any(w in text for w in [
            'dry', 'stream dried', 'no water', 'wells dry'
        ]),
        'unusual_birds': any(w in text for w in [
            'birds', 'unusual', 'flock leaving', 'no birds'
        ]),
        'soil_degradation': any(w in text for w in [
            'soil', 'dust', 'cracking', 'erosion', 'landslide'
        ])
    }