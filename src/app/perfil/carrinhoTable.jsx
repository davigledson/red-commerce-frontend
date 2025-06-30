// perfil/carrinhoTable.jsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import { CarrinhoService } from '@/services/CarrinhoService'; // Ajuste o caminho
import ItemCarrinhoService from '@/services/ItemCarrinhoService'; // Ajuste o caminho
import { useAuth } from '@/hooks/ContextoAuth'; // Ajuste o caminho
import MineDataTable from '@/components/MineDataTable'; // Certifique-se de que este caminho está correto
import axios from 'axios'; // Para tratamento de erros do Axios
import Link from 'next/link'; // Para linkar para a página de produtos

export default function carrinhoTable() {
  const { loggedInUser, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [errorCart, setErrorCart] = useState(null);
  const [userCartId, setUserCartId] = useState(null); // ID do carrinho do usuário

  // 1. Inicializa o carrinho do usuário (busca ou cria)
  const initializeUserCart = useCallback(async () => {
    if (authLoading || !loggedInUser || !loggedInUser.id) {
      setLoadingCart(false);
      setCartItems([]);
      return;
    }

    setLoadingCart(true);
    setErrorCart(null);
    try {
      let cart;
      try {
        cart = await CarrinhoService.buscarPorUsuario(loggedInUser.id);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
          cart = await CarrinhoService.criar({ usuario_id: loggedInUser.id });
          // Opcional: addToast("Carrinho criado para sua conta!", "success");
        } else {
          throw err;
        }
      }
      setUserCartId(cart.id);
    } catch (err) {
      console.error("Erro ao inicializar o carrinho do usuário:", err);
      setErrorCart("Erro ao carregar ou criar o carrinho.");
    } finally {
      setLoadingCart(false);
    }
  }, [loggedInUser, authLoading]);

  // 2. Busca os itens do carrinho
  const fetchCartItems = useCallback(async () => {
    if (!userCartId) {
      setCartItems([]);
      return;
    }

    setLoadingCart(true);
    setErrorCart(null);
    try {
      const rawItems = await ItemCarrinhoService.listarPorCarrinho(userCartId);
      
      // Mapeia os itens do carrinho para incluir detalhes do produto
      const detailedItems = rawItems.map(item => ({
        id: item.id, // ID do item_carrinho
        productId: item.produto_id, // ID do produto
        name: item.produto?.nome || 'Produto Desconhecido',
        category: item.produto?.categoria?.nome || 'Sem Categoria', // Adapte se tiver categoria
        price: parseFloat(item.produto?.preco || 0),
        image: item.produto?.imagem || '/imgs/planta.png', // Imagem do produto
        quantity: item.quantidade,
      }));
      setCartItems(detailedItems);
    } catch (err) {
      console.error("Erro ao carregar itens do carrinho:", err);
      setErrorCart("Erro ao carregar itens do carrinho.");
    } finally {
      setLoadingCart(false);
    }
  }, [userCartId]);

  // Efeitos para inicializar o carrinho e buscar itens
  useEffect(() => {
    initializeUserCart();
  }, [initializeUserCart]);

  useEffect(() => {
    if (userCartId) {
      fetchCartItems();
    }
  }, [userCartId, fetchCartItems]);

  // Funções de manipulação de itens (remover, atualizar quantidade)
  const updateQuantity = async (itemId, delta) => {
    const currentItem = cartItems.find(item => item.id === itemId);
    if (!currentItem) return;

    const newQty = currentItem.quantity + delta;
    if (newQty <= 0) {
      await removeItem(itemId);
      return;
    }

    setLoadingCart(true);
    try {
      await ItemCarrinhoService.atualizarQuantidade(itemId, newQty);
      await fetchCartItems(); // Recarrega os itens após a atualização
      // Opcional: addToast("Quantidade atualizada!", "success");
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
      // Opcional: addToast("Erro ao atualizar quantidade.", "error");
    } finally {
      setLoadingCart(false);
    }
  };

  const removeItem = async (itemId) => {
    if (!confirm('Tem certeza que deseja remover este item do carrinho?')) return;

    setLoadingCart(true);
    try {
      await ItemCarrinhoService.remover(itemId);
      await fetchCartItems(); // Recarrega os itens após a remoção
      // Opcional: addToast("Item removido do carrinho!", "success");
    } catch (err) {
      console.error("Erro ao remover item:", err);
      // Opcional: addToast("Erro ao remover item.", "error");
    } finally {
      setLoadingCart(false);
    }
  };

  // Colunas para a MineDataTable do carrinho
  const cartColumns = [
    { 
      key: 'name', 
      title: 'Produto', 
      render: (value, row) => (
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mr-3">
            <img 
              src={row.image || "/imgs/planta.png"} 
              alt={value}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    { key: 'price', title: 'Preço Unit.', render: (value) => `R$ ${value.toFixed(2).replace('.', ',')}` },
    { 
      key: 'quantity', 
      title: 'Quantidade', 
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateQuantity(row.id, -1)}
            className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100 text-gray-600"
          >
            –
          </button>
          <span className="text-base">{value}</span>
          <button
            onClick={() => updateQuantity(row.id, +1)}
            className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100 text-gray-600"
          >
            +
          </button>
        </div>
      )
    },
    { 
      key: 'subtotal', 
      title: 'Subtotal', 
      render: (_, row) => `R$ ${(row.price * row.quantity).toFixed(2).replace('.', ',')}` 
    },
  ];

  // Calcula o total do carrinho
  const totalCarrinho = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (loadingCart) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-700">Carregando carrinho...</p>
      </div>
    );
  }

  if (errorCart) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-lg">{errorCart}</p>
        <button onClick={fetchCartItems} className="mt-4 text-blue-600 hover:underline">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-gray-900">Meu Carrinho</h3>

      {cartItems.length === 0 ? (
        <div className="text-center py-10 text-gray-600 text-lg">
          Seu carrinho está vazio.
          <p className="mt-2">
            <Link href="/produtos" className="text-green-600 hover:underline">
              Comece a comprar agora!
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <MineDataTable
            columns={cartColumns}
            data={cartItems}
            showFooter
            footerContent={
              <div className="flex justify-between items-center p-4">
                <span className="text-lg font-semibold text-gray-900">Total do Carrinho:</span>
                <span className="text-lg font-bold text-green-600">
                  R$ {totalCarrinho.toFixed(2).replace('.', ',')}
                </span>
              </div>
            }
          />
          <div className="p-4 border-t border-gray-200 flex justify-end">
            <Link href="/comprar" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Finalizar Compra
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
