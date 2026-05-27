package br.PUCPay.WebSystem.service;

import br.PUCPay.WebSystem.dao.UsuarioDAO;
import br.PUCPay.WebSystem.dao.AlunoDAO;
import br.PUCPay.WebSystem.dao.ProfessorDAO;
import br.PUCPay.WebSystem.dao.EmpresaDAO;
import br.PUCPay.WebSystem.dto.LoginRequestDTO;
import br.PUCPay.WebSystem.dto.LoginResponseDTO;
import br.PUCPay.WebSystem.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioDAO usuarioDAO;

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioDAO.findByLogin(dto.getLogin())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!usuario.getSenha().equals(dto.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }

        LoginResponseDTO response = new LoginResponseDTO();
        response.setId(usuario.getId());
        response.setNome(usuario.getNome());
        response.setEmail(usuario.getEmail());
        response.setLogin(usuario.getLogin());
        response.setTelefone(usuario.getTelefone());
        response.setRole(usuario.getRole());

        if (usuario instanceof Aluno aluno) {
            response.setSaldo(aluno.getSaldo());
            response.setCpf(aluno.getCpf());
            response.setRg(aluno.getRg());
            response.setEndereco(aluno.getEndereco());
            response.setCurso(aluno.getCurso());
            response.setXpTotal(aluno.getXpTotal());
            response.setNivel(aluno.getNivel());
            response.setTotalResgates(aluno.getTotalResgates());
            response.setTotalMoedasRecebidas(aluno.getTotalMoedasRecebidas());
            if (aluno.getInstituicao() != null) {
                response.setInstituicaoId(aluno.getInstituicao().getId());
                response.setInstituicaoNome(aluno.getInstituicao().getNome());
            }
        } else if (usuario instanceof Professor prof) {
            response.setSaldo(prof.getSaldo());
            response.setCpf(prof.getCpf());
            response.setDepartamento(prof.getDepartamento());
            if (prof.getInstituicao() != null) {
                response.setInstituicaoId(prof.getInstituicao().getId());
                response.setInstituicaoNome(prof.getInstituicao().getNome());
            }
        } else if (usuario instanceof Empresa empresa) {
            response.setCnpj(empresa.getCnpj());
        }

        return response;
    }
}
