// perfil/favoritosTable.jsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import FavoritoService from '@/services/FavoritoService'; // Ajuste o caminho
import { useAuth } from '@/hooks/ContextoAuth'; // Ajuste o caminho
import MineDataTable from '@/components/MineDataTable'; // Certifique-se de que este caminho está correto
import axios from 'axios'; // Para tratamento de erros do Axios
import Link from 'next/link'; // Para linkar para a página de produtos

export default function FavoritosTable() {
  const { loggedInUser, loading: authLoading } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(true);
  const [errorFavoritos, setErrorFavoritos] = useState(null);

  // Função para carregar os favoritos do usuário
  const fetchFavoritos = useCallback(async () => {
    if (authLoading || !loggedInUser || !loggedInUser.id) {
      setLoadingFavoritos(false);
      setFavoritos([]);
      return;
    }

    setLoadingFavoritos(true);
    setErrorFavoritos(null);
    try {
      const data = await FavoritoService.listarPorUsuario(loggedInUser.id);
      // Mapeia os favoritos para extrair os dados do produto e formatar
      const favoritosFormatados = data.map(fav => ({
        id: fav.id, // ID do favorito (para remover)
        produto_id: fav.produto_id, // ID do produto
        ...fav.produto, // Espalha os detalhes do produto
        // Formata o preço se necessário
        preco: fav.produto?.preco ? parseFloat(fav.produto.preco).toFixed(2).replace('.', ',') : '0,00'
      }));
      setFavoritos(favoritosFormatados);
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
      let errorMessage = 'Erro ao carregar seus favoritos.';
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.errors) {
          errorMessage = err.response.data.errors.join(', ');
        }
      }
      setErrorFavoritos(errorMessage);
    } finally {
      setLoadingFavoritos(false);
    }
  }, [loggedInUser, authLoading]);

  // Carrega os favoritos quando o componente monta ou o usuário logado muda
  useEffect(() => {
    fetchFavoritos();
  }, [fetchFavoritos]);

  // Função para remover um item dos favoritos
  const removerDosFavoritos = async (favoritoId) => {
    if (!confirm('Tem certeza que deseja remover este item dos favoritos?')) return;

    setLoadingFavoritos(true);
    try {
      await FavoritoService.remover(favoritoId);
      await fetchFavoritos(); // Recarrega a lista
      // Opcional: addToast("Item removido dos favoritos.", "success");
    } catch (err) {
      console.error("Erro ao remover dos favoritos:", err);
      // Opcional: addToast("Erro ao remover item dos favoritos.", "error");
    } finally {
      setLoadingFavoritos(false);
    }
  };

  // Colunas para a MineDataTable de favoritos
  const favoritosColumns = [
    { 
      key: 'nome', 
      title: 'Produto', 
      render: (value, row) => (
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mr-3">
            <img 
              src={row.imagem || "/imgs/planta.png"} 
              alt={value}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    { key: 'preco', title: 'Preço', render: (value) => `R$ ${value}` },
    { key: 'especie', title: 'Espécie', whitespace: 'whitespace-normal' },
  ];

  if (loadingFavoritos) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-700">Carregando favoritos...</p>
      </div>
    );
  }

  if (errorFavoritos) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-lg">{errorFavoritos}</p>
        <button onClick={fetchFavoritos} className="mt-4 text-blue-600 hover:underline">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-gray-900">Meus Favoritos</h3>

      {favoritos.length === 0 ? (
        <div className="text-center py-10 text-gray-600 text-lg">
          Nenhum produto favorito encontrado.
          <p className="mt-2">
            <Link href="/produtos" className="text-green-600 hover:underline">
              Explore nossos produtos e adicione seus favoritos!
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <MineDataTable
            columns={favoritosColumns}
            data={favoritos}
            rowActions={(row) => (
              <>
                {/* Opcional: Botão para adicionar ao carrinho diretamente daqui */}
                {/* <button
                  onClick={() => alert(`Adicionar ${row.nome} ao carrinho`)}
                  className="text-green-600 hover:text-green-900 mr-4"
                >
                  Adicionar ao Carrinho
                </button> */}
                <button
                  onClick={() => removerDosFavoritos(row.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Remover
                </button>
              </>
            )}
          />
        </div>
      )}
    </div>
  );
}
