package br.PUCPay.WebSystem.controller;

import br.PUCPay.WebSystem.dto.LoginRequestDTO;
import br.PUCPay.WebSystem.dto.LoginResponseDTO;
import br.PUCPay.WebSystem.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }
}
