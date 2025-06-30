'use client'
import { useState, useEffect, useCallback } from "react";
import CardProduto from '@/components/CardProduto';
import Banner from '@/components/Banner';
import FilterSidebar from '@/components/FilterSidebar';
import CarrinhoSidebar from '@/components/CarrinhoSidebar';
import FavoritosSidebar from '@/components/FavoritosSidebar'; // Certifique-se de ter este componente
import ProdutoService from '@/services/ProdutoService'; 
import ItemCarrinhoService from '@/services/ItemCarrinhoService';
import { CarrinhoService } from '@/services/CarrinhoService';
import FavoritoService from '@/services/FavoritoService'; // Importe o serviço de favoritos
import { useAuth } from '@/hooks/ContextoAuth';
import { useToast } from '@/hooks/ContextoToast';
import axios from 'axios';

export default function Produtos() {
  const { loggedInUser, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [favoritosAberto, setFavoritosAberto] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [errorProdutos, setErrorProdutos] = useState(null);

  // Estados para o carrinho
  const [userCartId, setUserCartId] = useState(null);
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [loadingCarrinho, setLoadingCarrinho] = useState(true);
  const [errorCarrinho, setErrorCarrinho] = useState(null);

  // Estados para favoritos
  const [itensFavoritos, setItensFavoritos] = useState([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(true);
  const [errorFavoritos, setErrorFavoritos] = useState(null);

  // 1. Inicializa o carrinho do usuário (busca ou cria)
  useEffect(() => {
    const initializeUserCart = async () => {
      if (authLoading) {
        setLoadingCarrinho(true);
        return;
      }

      if (!loggedInUser) {
        setUserCartId(null);
        setItensCarrinho([]);
        setLoadingCarrinho(false);
        setErrorCarrinho("Você precisa estar logado para ter um carrinho."); 
        return;
      }

      if (userCartId) {
        setLoadingCarrinho(false);
        return;
      }

      setLoadingCarrinho(true);
      setErrorCarrinho(null); 
      try {
        let cart;
        try {
          cart = await CarrinhoService.buscarPorUsuario(loggedInUser.id);
        } catch (err) {
          if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
            console.log("Carrinho não encontrado, criando um novo...");
            cart = await CarrinhoService.criar({ usuario_id: loggedInUser.id });
            addToast("Carrinho criado com sucesso!", "success");
          } else {
            console.error("Erro inesperado ao buscar/criar carrinho:", err);
            throw err;
          }
        }
        setUserCartId(cart.id);
      } catch (err) {
        console.error("Erro final ao inicializar o carrinho do usuário:", err);
        setErrorCarrinho("Erro ao carregar ou criar o carrinho.");
        addToast("Erro ao inicializar seu carrinho. Tente novamente.", "error");
      } finally {
        setLoadingCarrinho(false);
      }
    };

    initializeUserCart();
  }, [loggedInUser, authLoading]);

  // 2. Busca os itens do carrinho quando o userCartId estiver disponível
  const fetchItensCarrinho = useCallback(async () => {
    if (!userCartId) {
      setItensCarrinho([]);
      return;
    }

    setLoadingCarrinho(true);
    setErrorCarrinho(null); 
    try {
      const itemsData = await ItemCarrinhoService.listarPorCarrinho(userCartId);
      setItensCarrinho(itemsData);
    } catch (err) {
      console.error("Erro ao carregar itens do carrinho:", err);
      setErrorCarrinho("Erro ao carregar itens do carrinho.");
      addToast("Erro ao carregar itens do carrinho.", "error");
    } finally {
      setLoadingCarrinho(false);
    }
  }, [userCartId]);

  // 3. Busca os favoritos do usuário
  const fetchFavoritos = useCallback(async () => {
    if (authLoading) {
      setLoadingFavoritos(true);
      return;
    }

    if (!loggedInUser) {
      setItensFavoritos([]);
      setLoadingFavoritos(false);
      setErrorFavoritos("Você precisa estar logado para ver seus favoritos.");
      return;
    }

    setLoadingFavoritos(true);
    setErrorFavoritos(null);
    try {
      const favoritosData = await FavoritoService.listarPorUsuario(loggedInUser.id);
      // Mapeia os favoritos para extrair os dados do produto
      const favoritosFormatados = favoritosData.map(fav => ({
        id: fav.id, // ID do favorito (para remover)
        produto_id: fav.produto_id, // ID do produto
        ...fav.produto, // Espalha os detalhes do produto
        // Formata o preço se necessário
        preco: fav.produto?.preco ? parseFloat(fav.produto.preco).toFixed(2) : '0.00'
      }));
      setItensFavoritos(favoritosFormatados);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
      setErrorFavoritos("Erro ao carregar favoritos.");
      addToast("Erro ao carregar seus favoritos.", "error");
    } finally {
      setLoadingFavoritos(false);
    }
  }, [loggedInUser, authLoading]);

  // Dispara a busca dos itens do carrinho quando userCartId muda
  useEffect(() => {
    fetchItensCarrinho();
  }, [userCartId, fetchItensCarrinho]);

  // Dispara a busca dos favoritos quando o usuário logado muda
  useEffect(() => {
    fetchFavoritos();
  }, [loggedInUser, authLoading, fetchFavoritos]);

  // 4. Busca os produtos (lógica existente)
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoadingProdutos(true);
        setErrorProdutos(null); 
        const data = await ProdutoService.listarTodos(); 
        
        const produtosFormatados = data.map(p => ({
          id: p.id,
          nome: p.nome,
          especie: p.especie || '',
          preco: parseFloat(p.preco).toFixed(2).replace('.', ','),
          imagem: p.imagem || "planta.png",
        }));
        setProdutos(produtosFormatados);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        let errorMessage = "Erro ao carregar produtos. Por favor, tente novamente.";
        if (axios.isAxiosError(err) && err.response && err.response.data) {
          if (err.response.data.errors) {
            errorMessage = err.response.data.errors.join(', ');
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          }
        }
        setErrorProdutos(errorMessage);
        addToast(errorMessage, "error");
      } finally {
        setLoadingProdutos(false);
      }
    };

    fetchProdutos();
  }, []);

  // Função para adicionar um produto ao carrinho
  const adicionarAoCarrinho = async (produto) => {
    if (!loggedInUser) {
      addToast("Você precisa estar logado para adicionar itens ao carrinho.", "warning");
      return;
    }
    if (loadingCarrinho) {
      addToast("Aguarde, o carrinho está sendo inicializado.", "info");
      return;
    }
    if (!userCartId) {
      addToast("Não foi possível inicializar o carrinho. Tente novamente.", "error");
      return;
    }

    try {
      await ItemCarrinhoService.adicionar({
        produto_id: produto.id,
        quantidade: 1 
      });
      setCarrinhoAberto(true);
      await fetchItensCarrinho(); 
      addToast(`${produto.nome} adicionado ao carrinho!`, "success");
    } catch (err) {
      console.error("Erro ao adicionar item ao carrinho:", err);
      let errorMessage = "Erro ao adicionar item ao carrinho.";
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        if (err.response.data.errors) {
          errorMessage = err.response.data.errors.join(', ');
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      addToast(errorMessage, "error");
    }
  };

  // Função para remover um item do carrinho
  const removerDoCarrinho = async (itemId) => { 
    if (!userCartId) return;

    setLoadingCarrinho(true); 
    setErrorCarrinho(null); 
    try {
      await ItemCarrinhoService.remover(itemId);
      await fetchItensCarrinho(); 
      addToast("Item removido do carrinho.", "success");
    } catch (err) {
      console.error("Erro ao remover item do carrinho:", err);
      setErrorCarrinho("Erro ao remover item do carrinho.");
      addToast("Erro ao remover item do carrinho.", "error");
    } finally {
      setLoadingCarrinho(false);
    }
  };

  // Função para adicionar um produto aos favoritos
  const adicionarAosFavoritos = async (produto) => {
    if (!loggedInUser) {
      addToast("Você precisa estar logado para adicionar favoritos.", "warning");
      return;
    }

    try {
      await FavoritoService.adicionar({ produto_id: produto.id });
      await fetchFavoritos();
      addToast(`${produto.nome} adicionado aos favoritos!`, "success");
    } catch (err) {
      console.error("Erro ao adicionar aos favoritos:", err);
      let errorMessage = "Erro ao adicionar produto aos favoritos.";
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        if (err.response.data.errors) {
          errorMessage = err.response.data.errors.join(', ');
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      addToast(errorMessage, "error");
    }
  };

  // Função para remover um item dos favoritos
  const removerDosFavoritos = async (favoritoId) => {
    try {
      await FavoritoService.remover(favoritoId);
      await fetchFavoritos();
      addToast("Item removido dos favoritos.", "success");
    } catch (err) {
      console.error("Erro ao remover dos favoritos:", err);
      addToast("Erro ao remover item dos favoritos.", "error");
    }
  };

  // Função para adicionar produto dos favoritos diretamente ao carrinho
  const adicionarFavoritoAoCarrinho = async (produto) => {
    if (!userCartId) {
      addToast("Carrinho não inicializado. Tente novamente.", "error");
      return;
    }

    try {
      await ItemCarrinhoService.adicionar({
        produto_id: produto.produto_id || produto.id,
        quantidade: 1
      });
      await fetchItensCarrinho();
      setCarrinhoAberto(true);
      addToast(`${produto.nome} adicionado ao carrinho!`, "success");
    } catch (err) {
      console.error("Erro ao adicionar favorito ao carrinho:", err);
      addToast("Erro ao adicionar item ao carrinho.", "error");
    }
  };

  // Condição de carregamento geral
  const overallLoading = loadingProdutos || loadingCarrinho || loadingFavoritos || authLoading;

  // Renderiza tela de carregamento se algo estiver carregando
  if (overallLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <p className="text-lg text-gray-700">Carregando...</p>
      </div>
    );
  }

  // Renderiza tela de erro FATAL (apenas para erros de produtos)
  if (errorProdutos) { 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h3 className="mt-4 text-xl font-medium text-gray-900">Erro ao carregar produtos</h3>
          <p className="mt-2 text-gray-600">{errorProdutos}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <CarrinhoSidebar
        aberto={carrinhoAberto}
        itens={itensCarrinho}
        onClose={() => setCarrinhoAberto(false)}
        onRemoverItem={removerDoCarrinho}
      />

      <FavoritosSidebar
        aberto={favoritosAberto}
        itens={itensFavoritos}
        onClose={() => setFavoritosAberto(false)}
        onRemoverItem={removerDosFavoritos}
        onAdicionarAoCarrinho={adicionarFavoritoAoCarrinho}
      />

      <div className="space-y-6 p-6">
        <Banner
          titulo="MUDAS"
          descricao="Encontre mudas saudáveis e prontas para florescer no seu jardim. Frutíferas, ornamentais e muito mais!"
          imagem="banner1.jpg"
        />

        {/* Botões de navegação para as sidebars */}
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={() => setFavoritosAberto(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Favoritos ({itensFavoritos.length} )
          </button>
          <button
            onClick={() => setCarrinhoAberto(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Carrinho ({itensCarrinho.length} )
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSidebar />
            </div>
          </div>
          
          <div className="flex-1">
            {/* Mensagens de erro/aviso */}
            {!loggedInUser && errorCarrinho && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
                <strong className="font-bold">Atenção!</strong>
                <span className="block sm:inline"> {errorCarrinho}</span>
                <p className="text-sm mt-1">Faça login para adicionar itens ao carrinho e gerenciar suas compras.</p>
              </div>
            )}
            
            {!loggedInUser && errorFavoritos && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
                <strong className="font-bold">Atenção!</strong>
                <span className="block sm:inline"> {errorFavoritos}</span>
                <p className="text-sm mt-1">Faça login para favoritar produtos.</p>
              </div>
            )}

            {loggedInUser && errorCarrinho && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
                <strong className="font-bold">Erro no Carrinho!</strong>
                <span className="block sm:inline"> {errorCarrinho}</span>
              </div>
            )}

            {produtos.length === 0 ? (
              <p className="text-center text-lg text-gray-700">Nenhum produto encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtos.map((produto) => (
                  <CardProduto 
                    key={produto.id} 
                    {...produto}
                    onAddCarrinho={() => adicionarAoCarrinho(produto)}
                    onAddFavoritos={() => adicionarAosFavoritos(produto)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
