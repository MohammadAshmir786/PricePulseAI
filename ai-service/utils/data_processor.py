import numpy as np
import pandas as pd

class DataProcessor:
    """Utility class for data processing and feature engineering"""
    
    @staticmethod
    def normalize_price(price):
        """Normalize price to 0-1 range"""
        return price / 10000
    
    @staticmethod
    def encode_category(category):
        """Encode category as numeric value"""
        category_map = {
            'electronics': 1,
            'wearables': 2,
            'accessories': 3,
            'power': 4,
            'peripherals': 5
        }
        return category_map.get(category.lower(), 0)
    
    @staticmethod
    def extract_features(product):
        """Extract and normalize features from product data"""
        features = {
            'price': DataProcessor.normalize_price(product.get('basePrice', 0)),
            'stock': product.get('stock', 0) / 100,
            'category': DataProcessor.encode_category(product.get('category', 'Unknown')),
            'tags_count': len(product.get('tags', [])),
            'has_image': 1 if product.get('images') else 0,
            'rating': product.get('ratingAverage', 0) / 5,
            'review_count': min(product.get('ratingCount', 0) / 100, 1)
        }
        return features
    
    @staticmethod
    def prepare_training_data(interactions):
        """Prepare interaction data for training"""
        df = pd.DataFrame(interactions)
        
        # Remove duplicates
        df = df.drop_duplicates(subset=['userId', 'productId'], keep='last')
        
        # Normalize ratings to 0-1
        if 'rating' in df.columns:
            df['rating_normalized'] = df['rating'] / 5
        
        return df
    
    @staticmethod
    def calculate_similarity_matrix(products):
        """Calculate product similarity matrix"""
        n = len(products)
        similarity_matrix = np.zeros((n, n))
        
        for i in range(n):
            for j in range(i+1, n):
                sim = DataProcessor.product_similarity(products[i], products[j])
                similarity_matrix[i][j] = sim
                similarity_matrix[j][i] = sim
        
        return similarity_matrix
    
    @staticmethod
    def product_similarity(prod1, prod2):
        """Calculate similarity between two products"""
        score = 0
        
        # Category match
        if prod1.get('category') == prod2.get('category'):
            score += 0.4
        
        # Tag overlap
        tags1 = set(prod1.get('tags', []))
        tags2 = set(prod2.get('tags', []))
        if tags1 and tags2:
            overlap = len(tags1 & tags2) / len(tags1 | tags2)
            score += overlap * 0.3
        
        # Price similarity
        price1 = prod1.get('basePrice', 0)
        price2 = prod2.get('basePrice', 0)
        if price1 > 0 and price2 > 0:
            price_diff = abs(price1 - price2) / max(price1, price2)
            score += (1 - price_diff) * 0.3
        
        return score
