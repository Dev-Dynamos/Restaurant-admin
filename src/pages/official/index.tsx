import Breadcrumb from '../../components/Breadcrumb';
import useFetch from '../../hooks/usefetch';
import DefaultLayout from '../../layout/DefaultLayout';
import { useState } from 'react';
import Modal from '../../components/Modal';
import { FormOfficial } from '../../components/FormOfficial';
import { api } from '../../services';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { FormOfficialEdit } from './EditOficial';
import TableThreeOfficial from '../../components/TableThreeOfficial';

type officilProps = {
  id: string;
  name: string;
  email: string;
  telefone: string;
  cargoId: string;
};

export const Official = () => {
  const { data: Official } = useFetch('/clerk');
  const { data: Cargo } = useFetch('/postion');
  const [item, setItem] = useState<officilProps>({
      email: '',
      name: '',
      telefone: '',
      cargoId: '',
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

  async function onRemove(item: { id: string; name: string}) {
    const resp = confirm(
      `Tens certeza que queres eliminar o(a) ${item?.name} `
    );
    if (resp) {
      try {
        const response = await api.delete(`/clerk/${item?.id}`);
        if (response) {
          mutate('/clerk');
          toast.success('Funcionario deletado com sucesso');
        }
      } catch (err: any) {
        toast.error(err?.error?.message);
      }
    }
  }

  console.log(Official);
  console.log(Cargo);

  return (
    <DefaultLayout>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <h2 className="mb-4 text-xl font-bold">Adicionar Funcionario</h2>
        <FormOfficial onclose={closeModal} />
      </Modal>

      <Modal isOpen={isOpenEdit} onClose={closeModalEdit}>
        <h2 className="mb-4 text-xl font-bold">Actulizar Funcionario</h2>
        <FormOfficialEdit onclose={closeModalEdit} item={item} />
      </Modal>

      <Breadcrumb pageName="Funcionarios" />

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
        <TableThreeOfficial
          heads={['Nome', 'Email', 'Telefone', 'cargo', 'Acção']}
          data={Official}
          onRemove={onRemove}
          openModalEdit={openModalEdit}
        />
      </div>
      {/* <!-- ====== Calendar Section End ====== --> */}
    </DefaultLayout>
  );
};
