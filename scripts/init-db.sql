-- Create text_processing_history table
CREATE TABLE IF NOT EXISTS text_processing_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    original_text TEXT NOT NULL,
    processed_text TEXT NOT NULL,
    operation VARCHAR(50) NOT NULL,
    tone VARCHAR(20),
    word_count_original INTEGER DEFAULT 0,
    word_count_processed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_id_created_at ON text_processing_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_operation ON text_processing_history(operation);

-- Insert sample data for testing
INSERT INTO text_processing_history (user_id, original_text, processed_text, operation, tone, word_count_original, word_count_processed) VALUES
('demo-user', 'This is a test sentence.', 'This serves as an example sentence for demonstration purposes.', 'paraphrase', 'formal', 5, 10),
('demo-user', 'The quick brown fox jumps over the lazy dog.', 'A swift brown fox leaps over a sluggish dog.', 'paraphrase', 'casual', 9, 8),
('demo-user', 'AI technology is revolutionizing many industries today.', 'Artificial Intelligence technology is transforming numerous sectors in the modern era.', 'expand', 'academic', 8, 12);
