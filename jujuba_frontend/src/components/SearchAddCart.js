import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  InputAdornment,
  CircularProgress,
  Typography,
} from "@mui/material";
import { listarProdutos, buscarProdutoPorId } from "../pages/api/produtos";
import { adicionarAoCarrinho, listarCarrinho } from "../pages/api/carrinho";

export default function SearchAddCart({ onAdded } = {}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await listarProdutos();
        if (resp?.sucesso && Array.isArray(resp.produtos)) {
          setOptions(
            resp.produtos.map((p) => ({
              id: p.id,
              label: p.descricao || p.nome || `#${p.id}`,
              produto: p,
            }))
          );
        } else {
          setOptions([]);
        }
      } catch (e) {
        setOptions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const handleAdd = async () => {
    if (!selected || !selected.produto) {
      setMessage({ type: "error", text: "Selecione um produto." });
      return;
    }
    const desired = Number(qty) || 1;
    if (desired <= 0) {
      setMessage({ type: "error", text: "Quantidade deve ser >= 1." });
      return;
    }

    // Fetch current stock to validate
    setBusy(true);
    setMessage(null);
    try {
      const p = await buscarProdutoPorId(selected.id);
      const estoque = Number(p?.produto?.quantidade) || 0;
      // O backend já decrementa o estoque ao adicionar ao carrinho, então
      // basta verificar se a quantidade desejada cabe no estoque atual.
      if (desired > estoque) {
        setMessage({
          type: "error",
          text: `Estoque insuficiente. Disponível: ${estoque}`,
        });
        setBusy(false);
        return;
      }

      // Use adicionarAoCarrinho with quantity; wrapper will loop if backend
      // only accepts one unit per request.
      const res = await adicionarAoCarrinho(selected.produto, desired);
      if (!res?.sucesso) {
        throw new Error(res?.mensagem || "Erro ao adicionar ao carrinho");
      }

      setMessage({
        type: "success",
        text: `${desired} unidade(s) adicionada(s) ao carrinho.`,
      });
      // notify others
      try {
        window.dispatchEvent(new Event("estoque-atualizado"));
      } catch (e) {}
      if (typeof onAdded === "function") onAdded(selected.produto, desired);
    } catch (e) {
      setMessage({ type: "error", text: e.message || "Erro ao adicionar." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Autocomplete
        options={options}
        getOptionLabel={(o) => o.label || String(o.id)}
        sx={{ minWidth: 320 }}
        loading={loading}
        onChange={(e, v) => {
          setSelected(v || null);
          setMessage(null);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Pesquisar produto"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <TextField
        label="Quantidade"
        type="number"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        InputProps={{
          startAdornment: <InputAdornment position="start">×</InputAdornment>,
        }}
        sx={{ width: 120 }}
      />

      <Button variant="contained" onClick={handleAdd} disabled={busy}>
        {busy ? <CircularProgress size={18} color="inherit" /> : "Adicionar"}
      </Button>

      {message && (
        <Typography
          sx={{ ml: 2 }}
          color={message.type === "error" ? "error.main" : "success.main"}
        >
          {message.text}
        </Typography>
      )}
    </Box>
  );
}
