package klu.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import klu.model.Product;
import klu.model.ProductManager;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.MimeTypeUtils;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    @Autowired
    private ProductManager PM;
    
    private final ObjectMapper objectMapper;

    public ProductController() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addProduct(
        @RequestPart(value = "product", required = true) String productJson,
        @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            logger.info("Received product JSON: {}", productJson);
            Product product = objectMapper.readValue(productJson, Product.class);
            
            if (photo != null && !photo.isEmpty()) {
                logger.info("Received photo: {}, size: {}", photo.getOriginalFilename(), photo.getSize());
                if (photo.getSize() > 2 * 1024 * 1024) { // 2MB
                    return ResponseEntity.badRequest().body("Photo size exceeds 2MB limit.");
                }
                
                String uploadDir = "uploads/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.write(filePath, photo.getBytes());
                product.setPhotoUrl("/products/photo/" + fileName);
            }
            
            String result = PM.addProduct(product);
            if (result.startsWith("200::")) {
                return ResponseEntity.ok(result.substring(5));
            } else {
                return ResponseEntity.badRequest().body(result.substring(5));
            }
        } catch (Exception e) {
            logger.error("Error adding product: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error uploading product: " + e.getMessage());
        }
    }

    @GetMapping("/photo/{filename:.+}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads", filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] photoBytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = MediaType.IMAGE_JPEG_VALUE;
            }
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(photoBytes);
        } catch (Exception e) {
            logger.error("Error serving photo: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update")
    public String updateProduct(@RequestBody Product P) {
        return PM.updateProduct(P);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteProduct(@PathVariable("id") int id) {
        return PM.deleteProduct(id);
    }

    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return PM.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable("id") int id) {
        return PM.getProductById(id);
    }

    @GetMapping("/seller/{email}")
    public List<Product> getProductsBySeller(@PathVariable("email") String email) {
        return PM.getProductsBySeller(email);
    }
}