'use client'
import { useState, useEffect, useCallback } from "react"; // Adicionado useCallback
import CardProduto from '@/components/CardProduto';
import Banner from '@/components/Banner';
import FilterSidebar from '@/components/FilterSidebar';
import CarrinhoSidebar from '@/components/CarrinhoSidebar';
import ProdutoService from '@/services/ProdutoService'; 
import ItemCarrinhoService from '@/services/ItemCarrinhoService';
import { CarrinhoService } from '@/services/CarrinhoService';
import { useAuth } from '@/hooks/ContextoAuth';
import axios from 'axios';

export default function Produtos() {
  const { loggedInUser, loading: authLoading } = useAuth();
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [errorProdutos, setErrorProdutos] = useState(null);

  // Estados para o carrinho
  const [userCartId, setUserCartId] = useState(null);
  const [itensCarrinho, setItensCarrinho] = useState([]); // Itens do carrinho vindos do backend
  const [loadingCarrinho, setLoadingCarrinho] = useState(true);
  const [errorCarrinho, setErrorCarrinho] = useState(null);

  // 1. Inicializa o carrinho do usuário (busca ou cria)
  useEffect(() => {
    const initializeUserCart = async () => {
      if (authLoading) {
        setLoadingCarrinho(true);
        return;
      }

      if (!loggedInUser) {
        setUserCartId(null);
        setItensCarrinho([]); // Limpa itens se não houver usuário logado
        setLoadingCarrinho(false);
        setErrorCarrinho("Você precisa estar logado para ter um carrinho.");
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
            cart = await CarrinhoService.criar({ usuario_id: loggedInUser.id });
          } else {
            throw err;
          }
        }
        setUserCartId(cart.id);
      } catch (err) {
        console.error("Erro ao inicializar o carrinho do usuário:", err);
        setErrorCarrinho("Erro ao carregar ou criar o carrinho.");
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
    } finally {
      setLoadingCarrinho(false);
    }
  }, [userCartId]); // Depende apenas do userCartId

  // Dispara a busca dos itens do carrinho quando userCartId muda
  useEffect(() => {
    fetchItensCarrinho();
  }, [userCartId, fetchItensCarrinho]); // Adicionado fetchItensCarrinho como dependência

  // 3. Busca os produtos (lógica existente)
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
      } finally {
        setLoadingProdutos(false);
      }
    };

    fetchProdutos();
  }, []);

  // Função para adicionar um produto ao carrinho
  const adicionarAoCarrinho = async (produto) => {
    if (!loggedInUser) {
      alert("Você precisa estar logado para adicionar itens ao carrinho.");
      return;
    }
    if (loadingCarrinho) {
      alert("Aguarde, o carrinho está sendo inicializado.");
      return;
    }
    if (!userCartId) {
      alert("Não foi possível inicializar o carrinho. Tente novamente.");
      return;
    }

    try {
      await ItemCarrinhoService.adicionar({
        carrinho_id: userCartId,
        produto_id: produto.id,
        quantidade: 1 
      });
      setCarrinhoAberto(true);
      await fetchItensCarrinho(); // Recarrega os itens do carrinho após adicionar
      alert(`${produto.nome} adicionado ao carrinho!`);
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
      alert(errorMessage);
    }
  };

  // Função para remover um item do carrinho
  const removerDoCarrinho = async (itemId) => { // Agora recebe o itemId do item_carrinho
    if (!userCartId) return;

    setLoadingCarrinho(true); // Indica que a remoção está em andamento
    setErrorCarrinho(null);
    try {
      await ItemCarrinhoService.remover(itemId);
      await fetchItensCarrinho(); // Recarrega a lista de itens
    } catch (err) {
      console.error("Erro ao remover item do carrinho:", err);
      setErrorCarrinho("Erro ao remover item do carrinho.");
    } finally {
      setLoadingCarrinho(false);
    }
  };

  // Condição de carregamento geral
  const overallLoading = loadingProdutos || loadingCarrinho || authLoading;

  if (overallLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <p className="text-lg text-gray-700">Carregando...</p>
      </div>
    );
  }

  // Exibição de erro geral
  if (errorProdutos || errorCarrinho) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h3 className="mt-4 text-xl font-medium text-gray-900">Erro ao carregar dados</h3>
          <p className="mt-2 text-gray-600">{errorProdutos || errorCarrinho}</p>
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
        itens={itensCarrinho} // Passa os itens do carrinho do estado
        onClose={() => setCarrinhoAberto(false)}
        onRemoverItem={removerDoCarrinho} // Passa a função de remover
      />

      <div className="space-y-6 p-6">
        <Banner
          titulo="MUDAS"
          descricao="Encontre mudas saudáveis e prontas para florescer no seu jardim. Frutíferas, ornamentais e muito mais!"
          imagem="banner1.jpg"
        />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSidebar />
            </div>
          </div>
          
          <div className="flex-1">
            {produtos.length === 0 ? (
              <p className="text-center text-lg text-gray-700">Nenhum produto encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtos.map((produto) => (
                  <CardProduto 
                    key={produto.id} 
                    {...produto}
                    onAddCarrinho={() => adicionarAoCarrinho(produto)} 
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
