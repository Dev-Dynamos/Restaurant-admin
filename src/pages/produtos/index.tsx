import Breadcrumb from '../../components/Breadcrumb';
import useFetch from '../../hooks/usefetch';
import DefaultLayout from '../../layout/DefaultLayout';
import { useState } from 'react';
import Modal from '../../components/Modal';
import { api } from '../../services';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { FormOfficialEdit } from './EditOficial';
import { FormProduct } from '../../components/FormProduct';
import TableThreeProduct from '../../components/TableThreeProduct';

type officilProps = {
  id: string;
  nome: string;
  categoriaId: string;
  ficheiroId: string;
  descricao: string;
  preco: number;
  categoria?: {
    nome: string
  },
  ficheiro?: {
    caminho: string
  }
};
export const Produtos = () => {
  const { data: Produtos } = useFetch('/product');
  const [item, setItem] = useState<officilProps>({
      preco: 0,
      nome: '',
      categoriaId: '',
      ficheiroId: '',
      id: '',
      descricao: '',
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModalEdit = (item: officilProps) => {
    setItem(item);
    setIsOpenEdit(true);
  };

  const closeModalEdit = () => {
    setIsOpenEdit(false);
  };

  async function onRemove(item: { id: string; nome: string  }) {
    const resp = confirm(
      `Tens certeza que queres eliminar o(a) ${item?.nome} `
    );
    console.log('====================================');
    console.log(item);
    console.log('====================================');
    if (resp) {
      try {
        const response = await api.delete(`/product/${item?.id}`);
        if (response.data) {
          mutate('/product');
          toast.success('Produto deletado com sucesso');
        }
      } catch (err: any) {
        toast.error(err?.error?.message);
      }
    }
  }

  return (
    <DefaultLayout>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <h2 className="mb-4 text-xl font-bold">Adicionar Producto</h2>
        <FormProduct onclose={closeModal} />
      </Modal>

      <Modal isOpen={isOpenEdit} onClose={closeModalEdit}>
        <h2 className="mb-4 text-xl font-bold">Actulizar Producto</h2>
        <FormOfficialEdit onclose={closeModalEdit} item={item} />
      </Modal>

      <Breadcrumb pageName="Produtos" />

      {/* <!-- ====== Calendar Section Start ====== --> */}
      <div className="flex flex-1 justify-end py-2">
        <button
          onClick={openModal}
          className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Adicionar
        </button>
      </div>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <TableThreeProduct
          heads={['Nome', 'Preço', 'Categoria', 'Acção']}
          data={Produtos}
          onRemove={onRemove}
          openModalEdit={openModalEdit}
        />
      </div>
      {/* <!-- ====== Calendar Section End ====== --> */}
    </DefaultLayout>
  );
};
