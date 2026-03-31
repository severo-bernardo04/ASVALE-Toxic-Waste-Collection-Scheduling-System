package com.asvale.service;

import com.asvale.model.UserModel;
import com.asvale.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String documentNumber) throws UsernameNotFoundException {
        UserModel user = userRepository.findByDocumentNumber(documentNumber)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        return new User(user.getDocumentNumber(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getUserType().name())));
    }
} 