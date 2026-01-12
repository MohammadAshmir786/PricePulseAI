import numpy as np
from collections import Counter
import re

class SentimentAnalyzer:
    def __init__(self):
        # Simple keyword-based sentiment analysis
        # In production, use BERT or other transformer models
        self.positive_words = set([
            'love', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
            'perfect', 'best', 'good', 'nice', 'awesome', 'recommend', 'happy',
            'satisfied', 'quality', 'worth', 'impressed', 'pleased'
        ])
        
        self.negative_words = set([
            'bad', 'terrible', 'awful', 'poor', 'worst', 'hate', 'disappointed',
            'waste', 'broken', 'defective', 'useless', 'horrible', 'unhappy',
            'issue', 'problem', 'returned', 'refund'
        ])
    
    def analyze_reviews(self, reviews):
        """
        Analyze sentiment of product reviews
        
        Args:
            reviews: List of {text, rating}
        
        Returns:
            Sentiment analysis results with scores and insights
        """
        if not reviews or len(reviews) == 0:
            return {
                'overall_sentiment': 'neutral',
                'sentiment_score': 0,
                'positive_percentage': 0,
                'negative_percentage': 0,
                'neutral_percentage': 0,
                'total_reviews': 0,
                'insights': []
            }
        
        sentiments = []
        sentiment_scores = []
        all_words = []
        
        for review in reviews:
            text = review.get('text', '').lower()
            rating = review.get('rating', 3)
            
            # Analyze text sentiment
            sentiment, score = self._analyze_text(text, rating)
            sentiments.append(sentiment)
            sentiment_scores.append(score)
            
            # Extract words for keyword analysis
            words = re.findall(r'\b\w+\b', text)
            all_words.extend(words)
        
        # Calculate statistics
        sentiment_counts = Counter(sentiments)
        total = len(sentiments)
        
        positive_pct = (sentiment_counts.get('positive', 0) / total) * 100
        negative_pct = (sentiment_counts.get('negative', 0) / total) * 100
        neutral_pct = (sentiment_counts.get('neutral', 0) / total) * 100
        
        # Overall sentiment
        avg_score = np.mean(sentiment_scores)
        if avg_score > 0.2:
            overall = 'positive'
        elif avg_score < -0.2:
            overall = 'negative'
        else:
            overall = 'neutral'
        
        # Extract insights
        insights = self._generate_insights(
            all_words,
            positive_pct,
            negative_pct,
            avg_score
        )
        
        # Find common positive and negative themes
        positive_themes = self._extract_themes(reviews, 'positive')
        negative_themes = self._extract_themes(reviews, 'negative')
        
        return {
            'overall_sentiment': overall,
            'sentiment_score': round(avg_score, 3),
            'positive_percentage': round(positive_pct, 1),
            'negative_percentage': round(negative_pct, 1),
            'neutral_percentage': round(neutral_pct, 1),
            'total_reviews': total,
            'average_rating': round(np.mean([r.get('rating', 3) for r in reviews]), 2),
            'insights': insights,
            'positive_themes': positive_themes[:3],
            'negative_themes': negative_themes[:3]
        }
    
    def _analyze_text(self, text, rating):
        """Analyze sentiment of a single text"""
        words = set(re.findall(r'\b\w+\b', text.lower()))
        
        # Count positive and negative words
        pos_count = len(words & self.positive_words)
        neg_count = len(words & self.negative_words)
        
        # Calculate sentiment score (-1 to 1)
        if pos_count == 0 and neg_count == 0:
            # Use rating as fallback
            score = (rating - 3) / 2  # Convert 1-5 to -1 to 1
        else:
            score = (pos_count - neg_count) / max(pos_count + neg_count, 1)
        
        # Determine sentiment category
        if score > 0.2:
            sentiment = 'positive'
        elif score < -0.2:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        return sentiment, score
    
    def _generate_insights(self, words, pos_pct, neg_pct, avg_score):
        """Generate insights from review analysis"""
        insights = []
        word_freq = Counter(words)
        
        # Overall sentiment insight
        if avg_score > 0.5:
            insights.append({
                'type': 'positive',
                'message': 'Customers are highly satisfied with this product'
            })
        elif avg_score < -0.3:
            insights.append({
                'type': 'warning',
                'message': 'Product has received significant negative feedback'
            })
        
        # Specific aspect insights
        if 'quality' in word_freq and word_freq['quality'] > 2:
            insights.append({
                'type': 'info',
                'message': 'Quality is frequently mentioned in reviews'
            })
        
        if 'price' in word_freq or 'worth' in word_freq:
            insights.append({
                'type': 'info',
                'message': 'Price/value is a common discussion point'
            })
        
        # Recommendation insight
        if pos_pct > 70:
            insights.append({
                'type': 'positive',
                'message': f'{round(pos_pct)}% of reviews are positive - consider highlighting in marketing'
            })
        elif neg_pct > 30:
            insights.append({
                'type': 'warning',
                'message': f'{round(neg_pct)}% negative reviews detected - investigate issues'
            })
        
        return insights
    
    def _extract_themes(self, reviews, sentiment_type):
        """Extract common themes from positive or negative reviews"""
        themes = []
        
        for review in reviews:
            text = review.get('text', '').lower()
            rating = review.get('rating', 3)
            
            # Filter by sentiment
            is_positive = rating >= 4
            is_negative = rating <= 2
            
            if sentiment_type == 'positive' and not is_positive:
                continue
            if sentiment_type == 'negative' and not is_negative:
                continue
            
            # Extract key phrases (simplified)
            if 'quality' in text:
                themes.append('quality')
            if 'price' in text or 'value' in text:
                themes.append('value')
            if 'delivery' in text or 'shipping' in text:
                themes.append('delivery')
            if 'customer service' in text or 'support' in text:
                themes.append('customer_service')
            if 'easy' in text or 'simple' in text:
                themes.append('ease_of_use')
            if 'durable' in text or 'sturdy' in text:
                themes.append('durability')
        
        # Return most common themes
        theme_counts = Counter(themes)
        return [theme for theme, count in theme_counts.most_common(5)]
