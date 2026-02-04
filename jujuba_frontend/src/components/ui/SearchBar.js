"use client";

import { TextField, InputAdornment, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { COLORS, SHADOWS } from "../../constants";

/**
 * Componente de barra de pesquisa padronizada
 * @param {Object} props
 * @param {string} props.value - Valor atual da pesquisa
 * @param {Function} props.onChange - Callback de mudança de valor
 * @param {string} props.placeholder - Placeholder do campo
 * @param {Array} props.options - Opções para autocomplete (opcional)
 * @param {boolean} props.useAutocomplete - Se deve usar autocomplete
 * @param {Object} props.sx - Estilos adicionais
 */
const SearchBar = ({
  value,
  onChange,
  placeholder = "Pesquisar...",
  options = [],
  useAutocomplete = false,
  sx = {},
}) => {
  const textFieldStyles = {
    width: "100%",
    maxWidth: "1800px",
    backgroundColor: COLORS.backgroundPaper,
    marginBottom: "50px",
    marginTop: "50px",
    borderRadius: "10px",
    "& .MuiOutlinedInput-root": {
      backgroundColor: COLORS.backgroundPaper,
      color: COLORS.textPrimary,
      borderRadius: "10px",
      "& fieldset": {
        borderColor: COLORS.borderLight,
      },
      "&:hover fieldset": {
        borderColor: COLORS.actionBlue,
      },
      "&.Mui-focused fieldset": {
        borderColor: COLORS.actionBlue,
      },
      boxShadow: SHADOWS.input,
    },
    "& .MuiInputBase-input": {
      padding: "14px 20px",
      fontSize: "18px",
    },
    ...sx,
  };

  const inputProps = {
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon sx={{ color: COLORS.textPrimary, fontSize: 24 }} />
      </InputAdornment>
    ),
    sx: {
      height: "60px",
      display: "flex",
      alignItems: "center",
      pl: 1,
    },
  };

  if (useAutocomplete) {
    return (
      <Autocomplete
        freeSolo
        open={false}
        disableOpenOnFocus
        options={options}
        value={value}
        onChange={(event, newValue) => {
          onChange(newValue || "");
        }}
        onInputChange={(event, newInputValue) => {
          onChange(newInputValue || "");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="outlined"
            size="medium"
            InputProps={{
              ...params.InputProps,
              ...inputProps,
            }}
            sx={textFieldStyles}
          />
        )}
        sx={{
          width: "100%",
          maxWidth: "1800px",
        }}
      />
    );
  }

  return (
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      variant="outlined"
      size="medium"
      InputProps={inputProps}
      sx={textFieldStyles}
    />
  );
};

export default SearchBar;
