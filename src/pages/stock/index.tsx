import Breadcrumb from '../../components/Breadcrumb';
import useFetch from '../../hooks/usefetch';
import DefaultLayout from '../../layout/DefaultLayout';
import { useState } from 'react';
import Modal from '../../components/Modal';
import { api } from '../../services';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { FormOfficialEdit } from './EditOficial';
import TableThreeStock from '../../components/TableThreeStock';
import { FormStock } from '../../components/FormStock';

type officilProps = {
  id: string;
  productoId: string;
  quantidade: number;
};

export const Stock = () => {
  const { data: Stock } = useFetch('/stock');
  const [item, setItem] = useState<officilProps>({
      productoId: "",
      quantidade: 0,
    id: '',
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

  async function onRemove(item: { id: string;  }) {
    const resp = confirm(
      `Tens certeza que queres eliminar o(a) ${item?.produto?.nome} `
    );
    if (resp) {
      try {
        const response = await api.delete(`/stock/${item?.id}`);
        if (response) {
          mutate('/stock');
          toast.success('item deletado com sucesso');
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
        <FormStock onclose={closeModal} />
      </Modal>

      <Modal isOpen={isOpenEdit} onClose={closeModalEdit}>
        <h2 className="mb-4 text-xl font-bold">Actulizar Menu</h2>
        <FormOfficialEdit onclose={closeModalEdit} item={item} />
      </Modal>

      <Breadcrumb pageName="Stock" />

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
        <TableThreeStock
          heads={['Nome', 'Preço', 'Categoria', 'quantidade', 'Acção']}
          data={Stock}
          onRemove={onRemove}
          openModalEdit={openModalEdit}
        />
      </div>
      {/* <!-- ====== Calendar Section End ====== --> */}
    </DefaultLayout>
  );
};
