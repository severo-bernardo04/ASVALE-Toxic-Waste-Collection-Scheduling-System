import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';

interface PixQRCodeProps {
  deliveryPrice: number;
  deliveryId: number;
  companyName: string;
}

const PixQRCode: React.FC<PixQRCodeProps> = ({ deliveryPrice, deliveryId, companyName }) => {
  const pixKey = "00000000000";
  const merchantName = "ASVALE";
  const merchantCity = "Sua Cidade";
  
  const generatePixPayload = () => {
    const payload = {
      pixKey,
      description: `Entrega #${deliveryId} - ${companyName}`,
      merchantName,
      merchantCity,
      amount: deliveryPrice,
      txid: `ASVALE${deliveryId}`
    };
    
    return JSON.stringify(payload);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Pagamento via PIX</h5>
      </Card.Header>
      <Card.Body>
        <Row className="align-items-center">
          <Col md={6} className="text-center">
            <QRCodeSVG
              value={generatePixPayload()}
              size={200}
              level="H"
            />
          </Col>
          <Col md={6}>
            <h6>Informações do Pagamento:</h6>
            <p><strong>Valor:</strong> R$ {deliveryPrice.toFixed(2)}</p>
            <p><strong>Identificador:</strong> #{deliveryId}</p>
            <p><strong>Beneficiário:</strong> {merchantName}</p>
            <small className="text-muted">
              Escaneie o QR Code com o aplicativo do seu banco para realizar o pagamento via PIX
            </small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PixQRCode; 