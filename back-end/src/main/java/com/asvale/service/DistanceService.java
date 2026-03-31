package com.asvale.service;

import com.asvale.dto.DistanceResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DistanceService {
    private static final Logger logger = LoggerFactory.getLogger(DistanceService.class);

    @Value("${google.maps.api.key}")
    private String apiKey;

    private static final String ASVALE_ADDRESS = "R. Zeferino Oliveira, 2 - Belizário, Santiago - RS, 97711-300";
    private static final double PRICE_PER_KM = 4.80;

    public DistanceResponseDTO calculateDistance(String destination) {
        logger.info("[DistanceService] Calculando distância para: {}", destination);
        String url = UriComponentsBuilder.fromHttpUrl("https://maps.googleapis.com/maps/api/directions/json")
                .queryParam("origin", ASVALE_ADDRESS)
                .queryParam("destination", destination)
                .queryParam("key", apiKey)
                .toUriString();

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);
        JSONObject json = new JSONObject(response);
        String status = json.optString("status");
        if (!"OK".equals(status)) {
            String userMessage;
            switch (status) {
                case "NOT_FOUND":
                    userMessage = "Endereço de origem ou destino não encontrado. Verifique se os endereços estão corretos.";
                    break;
                case "ZERO_RESULTS":
                    userMessage = "Não foi encontrada uma rota entre os endereços informados.";
                    break;
                case "REQUEST_DENIED":
                    userMessage = "A requisição à API do Google foi negada. Verifique a chave da API ou as permissões.";
                    break;
                case "OVER_QUERY_LIMIT":
                    userMessage = "Limite de requisições à API do Google atingido. Tente novamente mais tarde.";
                    break;
                case "INVALID_REQUEST":
                    userMessage = "Requisição inválida para a API do Google. Verifique os dados enviados.";
                    break;
                default:
                    userMessage = "Erro ao buscar rota: " + status;
            }
            throw new RuntimeException(userMessage);
        }
        JSONArray routes = json.getJSONArray("routes");
        JSONObject leg = routes.getJSONObject(0).getJSONArray("legs").getJSONObject(0);
        String distanceText = leg.getJSONObject("distance").getString("text");
        String duration = leg.getJSONObject("duration").getString("text");
        String polyline = routes.getJSONObject(0).getJSONObject("overview_polyline").getString("points");

        double km = 0.0;
        try {
            String kmStr = distanceText.replace(" km", "").replace(",", ".").trim();
            km = Double.parseDouble(kmStr);
        } catch (Exception e) {
            logger.error("[DistanceService] Erro ao converter distância para km: ", e);
            throw new RuntimeException("Erro ao converter distância para km: " + distanceText);
        }
        double price = Math.round(km * PRICE_PER_KM * 100.0) / 100.0;

        return new DistanceResponseDTO(distanceText, duration, polyline, price);
    }
} 