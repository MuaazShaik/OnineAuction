package klu.model;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class JMTManager {

    private final String SEC_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890MKDJSHIEUFBEICBWIEOWDWUU";
    private final SecretKey secretKey = Keys.hmacShaKeyFor(SEC_KEY.getBytes(StandardCharsets.UTF_8));

    public String generateToken(String email) {
        Map<String, Object> data = new HashMap<>();
        data.put("email", email);

        return Jwts.builder()
                .setClaims(data)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // valid for 1 day
                .signWith(secretKey)
                .compact();
    }

    public String validateToken(String token) {
        try {
            token = token.trim(); // remove any spaces
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Date expiration = claims.getExpiration();
            if (expiration == null || expiration.before(new Date())) {
                return "401";
            }

            return claims.get("email", String.class);
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getMessage());
            return "401";
        }
    }
}
