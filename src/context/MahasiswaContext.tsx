import React, { createContext, useContext, useState } from "react";

export interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  prodi: string;
  status: "Aktif" | "Cuti";
}

interface MahasiswaContextType {
  dataMahasiswa: Mahasiswa[];
  tambahMahasiswa: (mhsBaru: Omit<Mahasiswa, "id">) => void;
  hapusMahasiswa: (id: string) => void;
}

const MahasiswaContext = createContext<MahasiswaContextType | undefined>(
  undefined,
);

const DATA_AWAL: Mahasiswa[] = [
  { id: "1", nim: "230101001", nama: "Ahmad Fauzi", prodi: "Teknik Informatika", status: "Aktif" },
  { id: "2", nim: "230101002", nama: "Budi Santoso", prodi: "Sistem Informasi", status: "Aktif" },
  { id: "3", nim: "230101003", nama: "Citra Dewi", prodi: "Teknik Informatika", status: "Aktif" },
  { id: "4", nim: "230101004", nama: "Dedi Kurniawan", prodi: "Sistem Informasi", status: "Cuti" },
  { id: "5", nim: "230101005", nama: "Eka Rahmawati", prodi: "Teknik Informatika", status: "Aktif" },
];

export const MahasiswaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dataMahasiswa, setDataMahasiswa] = useState<Mahasiswa[]>(DATA_AWAL);

  const tambahMahasiswa = (mhsBaru: Omit<Mahasiswa, "id">) => {
    const itemBaru: Mahasiswa = {
      id: Date.now().toString(),
      ...mhsBaru,
    };
    setDataMahasiswa((prevData) => [itemBaru, ...prevData]);
  };

  const hapusMahasiswa = (id: string) => {
    setDataMahasiswa((prevData) => prevData.filter((item) => item.id !== id));
  };

  return (
    <MahasiswaContext.Provider
      value={{ dataMahasiswa, tambahMahasiswa, hapusMahasiswa }}
    >
      {children}
    </MahasiswaContext.Provider>
  );
};

export const useMahasiswa = () => {
  const context = useContext(MahasiswaContext);
  if (!context) {
    throw new Error(
      "useMahasiswa wajib digunakan di dalam <MahasiswaProvider>!",
    );
  }
  return context;
};
