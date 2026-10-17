-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema academia
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema academia
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `academia` DEFAULT CHARACTER SET utf8 ;
USE `academia` ;

-- -----------------------------------------------------
-- Table `academia`.`academia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`academia` (
  `idAcademia` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NOT NULL,
  `Endereco` VARCHAR(200) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idAcademia`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `senha_hash` VARCHAR(255) NOT NULL,
  `data_nascimento` DATETIME NULL,
  `objetivo` VARCHAR(255) NULL,
  `nivel_experiencia` VARCHAR(45) NULL,
  `perfil` VARCHAR(45) NULL,
  `matricula` VARCHAR(20) NULL,
  `curso` VARCHAR(100) NULL,
  `altura` DECIMAL(5,2) NULL,
  `peso` DECIMAL(5,2) NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `matricula_UNIQUE` (`matricula` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`ficha_treino`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`ficha_treino` (
  `idFicha_treino` INT NOT NULL AUTO_INCREMENT,
  `usuario_idUsuario` INT NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `objetivo` VARCHAR(255) NOT NULL,
  `criada_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idFicha_treino`),
  INDEX `fk_ficha_treino_usuario1_idx` (`usuario_idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_ficha_treino_usuario1`
    FOREIGN KEY (`usuario_idUsuario`)
    REFERENCES `academia`.`usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`equipamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`equipamento` (
  `idEquipamento` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  PRIMARY KEY (`idEquipamento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`exercicio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`exercicio` (
  `idExercicio` INT NOT NULL AUTO_INCREMENT,
  `equipamento_idEquipamento` INT NOT NULL,
  `nome` VARCHAR(45) NULL,
  `descricao` VARCHAR(150) NULL,
  `dificuldade` VARCHAR(45) NULL,
  `video_url` VARCHAR(255) NULL,
  PRIMARY KEY (`idExercicio`),
  INDEX `fk_exercicio_equipamento1_idx` (`equipamento_idEquipamento` ASC) VISIBLE,
  CONSTRAINT `fk_exercicio_equipamento1`
    FOREIGN KEY (`equipamento_idEquipamento`)
    REFERENCES `academia`.`equipamento` (`idEquipamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`ficha_exercicio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`ficha_exercicio` (
  `ficha_treino_idFicha_treino` INT NOT NULL,
  `idFicha_exercicio` INT NOT NULL AUTO_INCREMENT,
  `exercicio_idExercicio` INT NOT NULL,
  `ordem` INT NOT NULL,
  `series` INT NULL,
  `repeticoes` INT NULL,
  `carga` DECIMAL(6,2) NULL,
  INDEX `fk_ficha_exercicio_ficha_treino1_idx` (`ficha_treino_idFicha_treino` ASC) VISIBLE,
  PRIMARY KEY (`idFicha_exercicio`),
  INDEX `fk_ficha_exercicio_exercicio1_idx` (`exercicio_idExercicio` ASC) VISIBLE,
  CONSTRAINT `fk_ficha_exercicio_ficha_treino1`
    FOREIGN KEY (`ficha_treino_idFicha_treino`)
    REFERENCES `academia`.`ficha_treino` (`idFicha_treino`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ficha_exercicio_exercicio1`
    FOREIGN KEY (`exercicio_idExercicio`)
    REFERENCES `academia`.`exercicio` (`idExercicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`professor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`professor` (
  `idProfessor` INT NOT NULL AUTO_INCREMENT,
  `academia_idAcademia` INT NOT NULL,
  `usuario_idUsuario` INT NOT NULL,
  `bio` VARCHAR(100) NULL,
  `especialidade` VARCHAR(150) NULL,
  `registro_profissional` VARCHAR(150) NULL,
  `foto_url` VARCHAR(255) NULL,
  PRIMARY KEY (`idProfessor`),
  INDEX `fk_professor_academia1_idx` (`academia_idAcademia` ASC) VISIBLE,
  INDEX `fk_professor_usuario1_idx` (`usuario_idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_professor_academia1`
    FOREIGN KEY (`academia_idAcademia`)
    REFERENCES `academia`.`academia` (`idAcademia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_professor_usuario1`
    FOREIGN KEY (`usuario_idUsuario`)
    REFERENCES `academia`.`usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`mensagem`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`mensagem` (
  `idMensagem` INT NOT NULL AUTO_INCREMENT,
  `usuario_idUsuario` INT NOT NULL,
  `professor_idProfessor` INT NOT NULL,
  `texto` VARCHAR(255) NULL,
  `enviada_em` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `lida` TINYINT(1) NULL,
  PRIMARY KEY (`idMensagem`),
  INDEX `fk_mensagem_usuario1_idx` (`usuario_idUsuario` ASC) VISIBLE,
  INDEX `fk_mensagem_professor1_idx` (`professor_idProfessor` ASC) VISIBLE,
  CONSTRAINT `fk_mensagem_usuario1`
    FOREIGN KEY (`usuario_idUsuario`)
    REFERENCES `academia`.`usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mensagem_professor1`
    FOREIGN KEY (`professor_idProfessor`)
    REFERENCES `academia`.`professor` (`idProfessor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`musculo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`musculo` (
  `idMusculo` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `regiao_corpo` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idMusculo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`treino_realizado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`treino_realizado` (
  `idTreino_realizado` INT NOT NULL AUTO_INCREMENT,
  `usuario_idUsuario` INT NOT NULL,
  `ficha_exercicio_idFicha_exercicio` INT NOT NULL,
  `data_treino` DATETIME NOT NULL,
  `duracao_min` INT NULL,
  `observacoes` VARCHAR(255) NULL,
  PRIMARY KEY (`idTreino_realizado`),
  INDEX `fk_treino_realizado_usuario1_idx` (`usuario_idUsuario` ASC) VISIBLE,
  INDEX `fk_treino_realizado_ficha_exercicio1_idx` (`ficha_exercicio_idFicha_exercicio` ASC) VISIBLE,
  CONSTRAINT `fk_treino_realizado_usuario1`
    FOREIGN KEY (`usuario_idUsuario`)
    REFERENCES `academia`.`usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_treino_realizado_ficha_exercicio1`
    FOREIGN KEY (`ficha_exercicio_idFicha_exercicio`)
    REFERENCES `academia`.`ficha_exercicio` (`idFicha_exercicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`passo_exercicio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`passo_exercicio` (
  `idPasso_exercicio` INT NOT NULL AUTO_INCREMENT,
  `exercicio_idExercicio` INT NOT NULL,
  `ordem` INT NULL,
  `instrucao` VARCHAR(100) NULL,
  PRIMARY KEY (`idPasso_exercicio`),
  INDEX `fk_passo_exercicio_exercicio1_idx` (`exercicio_idExercicio` ASC) VISIBLE,
  CONSTRAINT `fk_passo_exercicio_exercicio1`
    FOREIGN KEY (`exercicio_idExercicio`)
    REFERENCES `academia`.`exercicio` (`idExercicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`exercicio_musculo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`exercicio_musculo` (
  `papel` VARCHAR(45) NULL,
  `exercicio_idExercicio` INT NOT NULL,
  `musculo_idMusculo` INT NOT NULL,
  PRIMARY KEY (`exercicio_idExercicio`, `musculo_idMusculo`),
  INDEX `fk_exercicio_musculo_musculo1_idx` (`musculo_idMusculo` ASC) VISIBLE,
  CONSTRAINT `fk_exercicio_musculo_exercicio1`
    FOREIGN KEY (`exercicio_idExercicio`)
    REFERENCES `academia`.`exercicio` (`idExercicio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_exercicio_musculo_musculo1`
    FOREIGN KEY (`musculo_idMusculo`)
    REFERENCES `academia`.`musculo` (`idMusculo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`agendamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`agendamento` (
  `idAgendamento` INT NOT NULL AUTO_INCREMENT,
  `usuario_idUsuario` INT NOT NULL,
  `professor_idProfessor` INT NOT NULL,
  `academia_idAcademia` INT NOT NULL,
  `tipo` VARCHAR(45) NULL,
  `data_hora` DATETIME NULL,
  `status` VARCHAR(45) NULL,
  PRIMARY KEY (`idAgendamento`),
  INDEX `fk_agendamento_usuario1_idx` (`usuario_idUsuario` ASC) VISIBLE,
  INDEX `fk_agendamento_professor1_idx` (`professor_idProfessor` ASC) VISIBLE,
  INDEX `fk_agendamento_academia1_idx` (`academia_idAcademia` ASC) VISIBLE,
  CONSTRAINT `fk_agendamento_usuario1`
    FOREIGN KEY (`usuario_idUsuario`)
    REFERENCES `academia`.`usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_agendamento_professor1`
    FOREIGN KEY (`professor_idProfessor`)
    REFERENCES `academia`.`professor` (`idProfessor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_agendamento_academia1`
    FOREIGN KEY (`academia_idAcademia`)
    REFERENCES `academia`.`academia` (`idAcademia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academia`.`dashboard`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academia`.`dashboard` (
  `idDashboard` INT NOT NULL AUTO_INCREMENT,
  `usuario_idUsuario` INT NOT NULL,
  `tipo` VARCHAR(45) NULL,
  `indicador` VARCHAR(45) NULL,
  `periodo_inicio` VARCHAR(45) NULL,
  `periodo_fim` VARCHAR(45) NULL,
  `atualizado_em` DATETIME NULL,
  PRIMARY KEY (`idDashboard`),
  INDEX `fk_dashboard_usuario1_idx` (`usuario_idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_dashboard_usuario1`
    FOREIGN KEY (`usuario_idUsuario`)
    REFERENCES `academia`.`usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
