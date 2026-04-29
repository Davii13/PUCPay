package br.PUCPay.WebSystem.controller;

import br.PUCPay.WebSystem.model.Instituicao;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
@CrossOrigin(origins = "*")
public class InstituicaoController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public ResponseEntity<List<Instituicao>> getAll() {
        List<Instituicao> list = entityManager.createQuery("from Instituicao", Instituicao.class).getResultList();
        return ResponseEntity.ok(list);
    }
}
