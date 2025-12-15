package com.cabinetmedical.gestioncabinet.service.admin;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;

@Service
public class DocumentService {

    private final Path uploadDir = Paths.get("uploads"); // dossier physique sur ton serveur

    public String saveFile(MultipartFile file) throws IOException {
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String filename = file.getOriginalFilename();
        Path targetLocation = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return filename; // stocke juste le nom du fichier en DB
    }

    public Resource loadFile(String filename) throws MalformedURLException {
        Path file = uploadDir.resolve(filename).normalize();
        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists()) throw new RuntimeException("Fichier non trouvé : " + filename);
        return resource;
    }
}
