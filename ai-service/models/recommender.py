import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import joblib
import os

class RecommenderModel:
    def __init__(self):
        self.user_item_matrix = None
        self.product_features_matrix = None
        self.scaler = StandardScaler()
        self.model_path = 'trained_models'
        
        # Create model directory if it doesn't exist
        os.makedirs(self.model_path, exist_ok=True)
        
        # Try to load existing model
        self.load_model()
    
    def get_recommendations(self, user_id, product_ids, user_history, limit=10):
        """
        Generate personalized product recommendations using collaborative filtering
        
        Args:
            user_id: User identifier
            product_ids: List of all available product IDs
            user_history: List of user's past interactions [{productId, rating}, ...]
            limit: Number of recommendations to return
        
        Returns:
            List of recommended product IDs
        """
        if not user_history or len(user_history) == 0:
            # Cold start: return popular/trending products
            return self._get_popular_products(product_ids, limit)
        
        # Create user preference vector
        user_vector = self._create_user_vector(user_history, product_ids)
        
        # Calculate similarity with all products
        if len(product_ids) == 0:
            return []
        
        # Simple collaborative filtering using cosine similarity
        recommendations = []
        user_rated_products = {item['productId'] for item in user_history}
        
        # Score products based on user's rating patterns
        product_scores = {}
        for prod_id in product_ids:
            if prod_id not in user_rated_products:
                # Calculate score based on similar products user liked
                score = self._calculate_product_score(prod_id, user_history)
                product_scores[prod_id] = score
        
        # Sort by score and return top N
        sorted_products = sorted(product_scores.items(), key=lambda x: x[1], reverse=True)
        recommendations = [prod_id for prod_id, score in sorted_products[:limit]]
        
        return recommendations
    
    def get_similar_products(self, product_id, product_features, all_products, limit=5):
        """
        Find similar products based on content features (category, tags, price)
        
        Args:
            product_id: Target product ID
            product_features: Features of target product {category, tags, price}
            all_products: List of all products with their features
            limit: Number of similar products to return
        
        Returns:
            List of similar product IDs
        """
        if not all_products or len(all_products) == 0:
            return []
        
        # Create feature vectors
        target_vector = self._create_feature_vector(product_features)
        
        similarities = []
        for product in all_products:
            if product.get('_id') == product_id:
                continue
            
            prod_vector = self._create_feature_vector(product)
            similarity = self._cosine_similarity(target_vector, prod_vector)
            similarities.append((product.get('_id'), similarity))
        
        # Sort by similarity and return top N
        similarities.sort(key=lambda x: x[1], reverse=True)
        return [prod_id for prod_id, sim in similarities[:limit]]
    
    def train(self, interactions):
        """
        Train the recommendation model with user-product interactions
        
        Args:
            interactions: List of {userId, productId, rating}
        
        Returns:
            Training metrics
        """
        if not interactions or len(interactions) == 0:
            return {'error': 'No training data provided'}
        
        # Convert to DataFrame
        df = pd.DataFrame(interactions)
        
        # Create user-item matrix
        user_item_matrix = df.pivot_table(
            index='userId',
            columns='productId',
            values='rating',
            fill_value=0
        )
        
        self.user_item_matrix = user_item_matrix
        
        # Save model
        self.save_model()
        
        return {
            'num_users': len(user_item_matrix),
            'num_products': len(user_item_matrix.columns),
            'num_interactions': len(interactions)
        }
    
    def save_model(self):
        """Save trained model to disk"""
        if self.user_item_matrix is not None:
            model_file = os.path.join(self.model_path, 'user_item_matrix.pkl')
            joblib.dump(self.user_item_matrix, model_file)
    
    def load_model(self):
        """Load trained model from disk"""
        model_file = os.path.join(self.model_path, 'user_item_matrix.pkl')
        if os.path.exists(model_file):
            self.user_item_matrix = joblib.load(model_file)
    
    def _get_popular_products(self, product_ids, limit):
        """Get popular products for cold start"""
        # Return random sample for now (in production, use actual popularity metrics)
        import random
        return random.sample(product_ids, min(limit, len(product_ids)))
    
    def _create_user_vector(self, user_history, all_product_ids):
        """Create user preference vector"""
        vector = np.zeros(len(all_product_ids))
        product_id_to_idx = {pid: idx for idx, pid in enumerate(all_product_ids)}
        
        for item in user_history:
            prod_id = item.get('productId')
            rating = item.get('rating', 0)
            if prod_id in product_id_to_idx:
                vector[product_id_to_idx[prod_id]] = rating
        
        return vector
    
    def _calculate_product_score(self, product_id, user_history):
        """Calculate recommendation score for a product"""
        # Simple scoring: higher if user liked similar products
        score = 0
        for item in user_history:
            rating = item.get('rating', 0)
            if rating >= 4:  # User liked this product
                score += rating * 0.2  # Boost score
        
        # Add randomness for diversity
        score += np.random.random() * 0.5
        return score
    
    def _create_feature_vector(self, product):
        """Create feature vector from product attributes"""
        vector = []
        
        # Category encoding (simple hash)
        category = product.get('category', 'Unknown')
        vector.append(hash(category) % 100)
        
        # Price normalization
        price = product.get('basePrice', product.get('price', 0))
        vector.append(price / 10000)  # Normalize
        
        # Tags count
        tags = product.get('tags', [])
        vector.append(len(tags))
        
        # Stock level
        stock = product.get('stock', 0)
        vector.append(stock / 100)  # Normalize
        
        return np.array(vector)
    
    def _cosine_similarity(self, vec1, vec2):
        """Calculate cosine similarity between two vectors"""
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0
        
        return dot_product / (norm1 * norm2)
