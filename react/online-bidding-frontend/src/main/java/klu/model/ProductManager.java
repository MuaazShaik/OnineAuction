package klu.model;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import klu.repo.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
public class ProductManager {

    private static final Logger logger = LoggerFactory.getLogger(ProductManager.class);

    @Autowired
    private ProductRepository PR;

    @Transactional
    public String addProduct(Product product) {
        try {
            // Validate required fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return "400::Product name is required";
            }
            if (product.getPrice() <= 0) {
                return "400::Product price must be greater than 0";
            }
            if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
                return "400::Product category is required";
            }
            if (product.getSellerEmail() == null || product.getSellerEmail().trim().isEmpty()) {
                return "400::Seller email is required";
            }

            // Set default values if not provided
            if (product.getQuantity() <= 0) {
                product.setQuantity(1);
            }
            if (product.getExpiryDate() == null) {
                product.setExpiryDate(LocalDate.now().plusYears(1)); // Default expiry 1 year from now
            }

            PR.save(product);
            logger.info("Product added successfully: {}", product.getName());
            return "200::Product Added Successfully";
        } catch (Exception e) {
            logger.error("Error adding product: ", e);
            return "500::Error adding product: " + e.getMessage();
        }
    }

    @Transactional
    public String updateProduct(Product product) {
        try {
            if (!PR.existsById(product.getId())) {
                return "404::Product Not Found";
            }

            // Validate required fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return "400::Product name is required";
            }
            if (product.getPrice() <= 0) {
                return "400::Product price must be greater than 0";
            }
            if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
                return "400::Product category is required";
            }
            if (product.getSellerEmail() == null || product.getSellerEmail().trim().isEmpty()) {
                return "400::Seller email is required";
            }

            PR.save(product);
            logger.info("Product updated successfully: {}", product.getName());
            return "200::Product Updated Successfully";
        } catch (Exception e) {
            logger.error("Error updating product: ", e);
            return "500::Error updating product: " + e.getMessage();
        }
    }

    @Transactional
    public String deleteProduct(int id) {
        try {
            if (!PR.existsById(id)) {
                return "404::Product Not Found";
            }
            PR.deleteById(id);
            logger.info("Product deleted successfully with id: {}", id);
            return "200::Product Deleted Successfully";
        } catch (Exception e) {
            logger.error("Error deleting product: ", e);
            return "500::Error deleting product: " + e.getMessage();
        }
    }

    public List<Product> getAllProducts() {
        try {
            List<Product> products = PR.findAll();
            logger.info("Retrieved {} products", products.size());
            return products;
        } catch (Exception e) {
            logger.error("Error retrieving all products: ", e);
            throw new RuntimeException("Error retrieving products", e);
        }
    }

    public List<Product> getProductsBySeller(String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Email cannot be empty");
            }
            List<Product> products = PR.findBySellerEmail(email);
            logger.info("Retrieved {} products for seller: {}", products.size(), email);
            return products;
        } catch (Exception e) {
            logger.error("Error retrieving products for seller {}: ", email, e);
            throw new RuntimeException("Error retrieving seller products", e);
        }
    }
    
    public Product getProductById(int id) {
        try {
            Product product = PR.findById(id).orElse(null);
            if (product == null) {
                logger.warn("Product not found with id: {}", id);
            } else {
                logger.info("Retrieved product: {}", product.getName());
            }
            return product;
        } catch (Exception e) {
            logger.error("Error retrieving product with id {}: ", id, e);
            throw new RuntimeException("Error retrieving product", e);
        }
    }
} 