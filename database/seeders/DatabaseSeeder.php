<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\Buku\Models\Buku;
use Modules\Peminjaman\Database\Seeders\PeminjamanDatabaseSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // forceCreate: kolom role tidak perlu masuk $fillable
        User::forceCreate([
            'name' => 'Petugas Perpustakaan',
            'email' => 'admin@sipustaka.test',
            'password' => 'password',
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        User::forceCreate([
            'name' => 'Anggota Satu',
            'email' => 'user@sipustaka.test',
            'password' => 'password',
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        $buku = [
            ['Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 5],
            ['Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, 3],
            ['Negeri 5 Menara', 'Ahmad Fuadi', 'Gramedia', 2009, 4],
            ['Pemrograman Web dengan Laravel', 'Budi Raharjo', 'Informatika', 2022, 6],
            ['Basis Data', 'Abdul Kadir', 'Andi', 2018, 7],
            ['Algoritma dan Struktur Data', 'Rinaldi Munir', 'Informatika', 2016, 5],
            ['Sistem Operasi', 'Andrew Tanenbaum', 'Pearson', 2015, 2],
            ['Jaringan Komputer', 'Andrew Tanenbaum', 'Pearson', 2011, 3],
            ['Cantik Itu Luka', 'Eka Kurniawan', 'Gramedia', 2002, 4],
            ['Ronggeng Dukuh Paruk', 'Ahmad Tohari', 'Gramedia', 1982, 2],
            ['Filosofi Teras', 'Henry Manampiring', 'Kompas', 2018, 8],
            ['Atomic Habits', 'James Clear', 'Gramedia', 2019, 6],
        ];

        foreach ($buku as [$judul, $penulis, $penerbit, $tahun, $stok]) {
            Buku::create([
                'judul' => $judul,
                'penulis' => $penulis,
                'penerbit' => $penerbit,
                'tahun_terbit' => $tahun,
                'stok' => $stok,
            ]);
        }
        $this->call([
            PeminjamanDatabaseSeeder::class,
        ]);
    }

}
