import React from "react";
import { Form, StyledTextField } from "@/presentation/styles/styled-components";

import { ProfessorDTO } from "@/data/models/professor-dto";
import { IAuthService } from "@/domain/usecases/authentication-interface";
import { IProfessorService } from "@/domain/usecases/professor-interface";
import { ProfessorViewModel } from "@/presentation/models/professor";
import { StyledButton } from "@/presentation/styles/styled-components";
import { cpfMask } from "@/presentation/utils";
import { Box, FormHelperText } from "@mui/material";
import { validateCPF, validateConfirmPassword, validateProfessorEmail, validateIdLattes, validateName, validatePassword, validateSIAPE } from "../../validations";

type ProfessorError = {
    name: string | null;
    CPF: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
    SIAPE: string | null;
    identifyLattes: string | null;
};

interface Props {
    authService: IAuthService;
    professorService: IProfessorService;
    professor: ProfessorViewModel;
    setProfessor: (professor: any) => void;
    setEmailValidationPending: (emailValidationPending: boolean) => void;
}

export const ProfessorForm: React.FC<Props> = ({ authService, professorService, professor, setProfessor, setEmailValidationPending }) => {

    const [errors, setErrors] = React.useState<ProfessorError>();
    const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);

    const handleTextFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            setProfessor((prevProfessor: any) => ({
                ...prevProfessor,
                [name]: value,
            }));
        },
        [setProfessor]
    );

    const handleCPFChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            if (value.length < 15)
                setProfessor((prevProfessor: any) => ({
                    ...prevProfessor,
                    CPF: cpfMask(value),
                }));
        },
        [setProfessor]
    );

    const handleSIAPEChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            if (value.length < 8)
                setProfessor((prevProfessor: any) => ({
                    ...prevProfessor,
                    SIAPEEnrollment: value.replace(/\D/g, ''),
                }));
        },
        [setProfessor]
    );

    const handleIdLattesChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setProfessor((prevProfessor: any) => ({
                ...prevProfessor,
                identifyLattes: value.replace(/\D/g, ''),
            }));
        },
        [setProfessor]
    );

    function mapProfessorViewModelToDTO(professor: ProfessorViewModel): ProfessorDTO {
        return {
            name: professor.name!,
            CPF: professor.CPF!,
            email: professor.email!,
            password: professor.password!,
            SIAPEEnrollment: professor.SIAPEEnrollment!,
            identifyLattes: parseInt(professor.identifyLattes!)
        };
    }

    const goBack = (_event: React.MouseEvent<HTMLButtonElement>) => {
        history.back();
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                setButtonDisable(true);
                const professorDTO = mapProfessorViewModelToDTO(professor);
                await professorService.add(professorDTO);
                setEmailValidationPending(true);
            } catch (error) {
                console.error(error);
                setButtonDisable(false);
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ProfessorError = {
            name: validateName(professor.name),
            CPF: validateCPF(professor.CPF),
            email: validateProfessorEmail(professor.email),
            password: validatePassword(professor.password),
            confirmPassword: validateConfirmPassword(professor.password, professor.confirmPassword),
            SIAPE: validateSIAPE(professor.SIAPEEnrollment),
            identifyLattes: validateIdLattes(professor.identifyLattes)
        };

        if (
            newErrors.name ||
            newErrors.CPF ||
            newErrors.email ||
            newErrors.password ||
            newErrors.confirmPassword ||
            newErrors.SIAPE ||
            newErrors.identifyLattes
        )
            setErrors(newErrors);
        else
            return true;

        return false;
    };

    return (
        <Form onSubmit={handleFormSubmit}>
            <StyledTextField
                label="Nome"
                name="name"
                value={professor.name}
                error={errors && errors.name !== null}
                onChange={handleTextFieldChange}
            />

            {errors?.name && <FormHelperText error>{errors.name}</FormHelperText>}
            <StyledTextField
                label="CPF"
                type="text"
                name="CPF"
                value={professor.CPF}
                error={errors && errors.CPF !== null}
                onChange={handleCPFChange}
            />

            {errors?.CPF && <FormHelperText error>{errors.CPF}</FormHelperText>}
            <StyledTextField
                label="Email Institucional"
                type="text"
                name="email"
                value={professor.email}
                error={errors && errors.email !== null}
                onChange={handleTextFieldChange}
            />

            {errors?.email && <FormHelperText error>{errors.email}</FormHelperText>}
            <StyledTextField
                label="Senha"
                type="password"
                name="password"
                value={professor.password}
                error={errors && errors.password !== null}
                onChange={handleTextFieldChange}
            />

            {errors?.password && <FormHelperText error>{errors.password}</FormHelperText>}
            <StyledTextField
                label="Confirmação de senha"
                type="password"
                variant="outlined"
                name="confirmPassword"
                value={professor.confirmPassword}
                error={errors && errors.confirmPassword !== null}
                onChange={handleTextFieldChange}
            />

            {errors?.confirmPassword && <FormHelperText error>{errors.confirmPassword}</FormHelperText>}
            <StyledTextField
                label="SIAPE"
                type="text"
                name="SIAPEEnrollment"
                value={professor.SIAPEEnrollment}
                error={errors && errors.SIAPE !== null}
                onChange={handleSIAPEChange}
                inputProps={{ pattern: '[0-9]*' }}
            />

            {errors?.SIAPE && <FormHelperText error>{errors.SIAPE}</FormHelperText>}
            <StyledTextField
                label="Identificador Lattes"
                type="text"
                name="identifyLattes"
                value={professor.identifyLattes}
                error={errors && errors.identifyLattes !== null}
                onChange={handleIdLattesChange}
                inputProps={{ pattern: '[0-9]*' }}
            />
            {errors?.identifyLattes && <FormHelperText error>{errors.identifyLattes}</FormHelperText>}


            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pt: 2 }}>
                <StyledButton variant="outlined" color="primary" type="button" onClick={goBack}>
                    Voltar
                </StyledButton>
                <StyledButton disabled={buttonDisable} variant="contained" color="primary" type="submit">
                    Avançar
                </StyledButton>
            </Box>
        </Form>
    );
};
