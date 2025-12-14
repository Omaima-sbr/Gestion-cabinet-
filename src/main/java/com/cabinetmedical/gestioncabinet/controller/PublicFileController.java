package com.cabinetmedical.gestioncabinet.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PublicFileController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    /**
     * Endpoint pour servir les fichiers uploads (logos, documents, etc.)
     * URL: /uploads/logos/logo.png
     */
    @GetMapping("/uploads/**")
    public ResponseEntity<Resource> getUploadedFile() {
        try {
            // Récupérer la requête HTTP actuelle
            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpServletRequest request = attributes.getRequest();

            // Récupérer le chemin complet depuis l'URL
            String requestPath = request.getRequestURI();

            // Extraire le chemin après /uploads/
            String relativePath = requestPath.substring(requestPath.indexOf("/uploads/") + 9);

            System.out.println("📂 [Files] Demande de fichier:");
            System.out.println("   → URL demandée: " + requestPath);
            System.out.println("   → Chemin relatif: " + relativePath);
            System.out.println("   → Upload dir: " + uploadDir);

            // Construire le chemin complet
            File uploadPath = new File(uploadDir);
            Path filePath = Paths.get(uploadPath.getAbsolutePath(), relativePath).normalize();

            System.out.println("   → Chemin absolu: " + filePath);

            // Vérification de sécurité : le fichier doit être dans uploads/
            if (!filePath.startsWith(uploadPath.getAbsolutePath())) {
                System.out.println("❌ [Files] Tentative d'accès en dehors d'uploads");
                return ResponseEntity.badRequest().build();
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = getContentType(relativePath);
                System.out.println("✅ [Files] Fichier trouvé, type: " + contentType);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + resource.getFilename() + "\"")
                        .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                        .body(resource);
            } else {
                System.out.println("❌ [Files] Fichier non trouvé ou non lisible:");
                System.out.println("   → Existe: " + resource.exists());
                System.out.println("   → Lisible: " + (resource.exists() && resource.isReadable()));
                System.out.println("   → Fichier system: " + filePath.toFile().exists());

                // Lister le contenu du dossier pour debug
                File parentDir = filePath.getParent().toFile();
                if (parentDir.exists() && parentDir.isDirectory()) {
                    System.out.println("   → Contenu du dossier parent:");
                    File[] files = parentDir.listFiles();
                    if (files != null) {
                        for (File f : files) {
                            System.out.println("      - " + f.getName());
                        }
                    }
                }

                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("❌ [Files] Erreur:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private String getContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lower.endsWith(".png")) {
            return "image/png";
        } else if (lower.endsWith(".gif")) {
            return "image/gif";
        } else if (lower.endsWith(".svg")) {
            return "image/svg+xml";
        } else if (lower.endsWith(".webp")) {
            return "image/webp";
        } else if (lower.endsWith(".pdf")) {
            return "application/pdf";
        }
        return "application/octet-stream";
    }
}