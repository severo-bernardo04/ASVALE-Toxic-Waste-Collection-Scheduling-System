CREATE TABLE pix_payments (
    id BIGSERIAL PRIMARY KEY,
    delivery_id BIGINT NOT NULL,
    txid VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    qr_code TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    paid_at TIMESTAMP,
    CONSTRAINT fk_pix_payment_delivery FOREIGN KEY (delivery_id) REFERENCES deliveries(id)
); 