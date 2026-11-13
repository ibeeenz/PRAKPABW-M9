<?php

namespace Modules\Peminjaman\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Peminjaman\Http\Requests\PeminjamanRequest;
use Modules\Peminjaman\Models\Peminjaman;

class PeminjamanController extends Controller
{
    // halaman React; seluruh data dimuat lewat fetch() ke endpoint JSON di bawah
    public function index(): Response
    {
        return Inertia::render('Peminjaman/Index');
    }

    // data untuk tabel (JSON)
    public function data()
    {
        $list = Peminjaman::latest()->get()->map(fn ($p) => $this->format($p));

        return response()->json($list);
    }

    // satu data untuk form edit (JSON)
    public function show(Peminjaman $peminjaman)
    {
        return response()->json($this->format($peminjaman));
    }

    public function store(PeminjamanRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('bukti')) {
            $data['bukti'] = $request->file('bukti')->store('bukti', 'public');
        }

        $peminjaman = Peminjaman::create($data);

        return response()->json([
            'message' => 'Data peminjaman berhasil ditambahkan.',
            'data' => $this->format($peminjaman),
        ], 201);
    }

    public function update(PeminjamanRequest $request, Peminjaman $peminjaman)
    {
        $data = $request->validated();

        if ($request->hasFile('bukti')) {
            // hapus berkas lama saat diganti
            if ($peminjaman->bukti) {
                Storage::disk('public')->delete($peminjaman->bukti);
            }
            $data['bukti'] = $request->file('bukti')->store('bukti', 'public');
        } else {
            unset($data['bukti']); // pertahankan berkas lama
        }

        $peminjaman->update($data);

        return response()->json([
            'message' => 'Data peminjaman berhasil diubah.',
            'data' => $this->format($peminjaman),
        ]);
    }

    public function destroy(Peminjaman $peminjaman)
    {
        // berkas ikut terhapus dari storage
        if ($peminjaman->bukti) {
            Storage::disk('public')->delete($peminjaman->bukti);
        }

        $peminjaman->delete();

        return response()->json(['message' => 'Data peminjaman berhasil dihapus.']);
    }

    private function format(Peminjaman $p): array
    {
        return [
            'id' => $p->id,
            'nama_peminjam' => $p->nama_peminjam,
            'judul_buku' => $p->judul_buku,
            'tanggal_pinjam' => $p->tanggal_pinjam->format('Y-m-d'),
            'tanggal_kembali' => $p->tanggal_kembali->format('Y-m-d'),
            'status' => $p->status,
            'bukti_url' => $p->bukti ? asset('storage/'.$p->bukti) : null,
        ];
    }
}
