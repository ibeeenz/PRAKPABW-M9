<?php

namespace Modules\UserManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\UserManagement\Http\Requests\StoreUserRequest;
use Modules\UserManagement\Http\Requests\UpdateUserRequest;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('UserManagement/Index', [
            'users' => $users,
            'currentUserId' => auth()->id(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('UserManagement/Create');
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        // forceCreate: kolom role tidak perlu masuk $fillable; password di-hash oleh cast model
        User::forceCreate($request->validated() + ['email_verified_at' => now()]);

        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('UserManagement/Edit', [
            'user' => $user->only('id', 'name', 'email', 'role'),
            'currentUserId' => auth()->id(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        // password hanya diubah jika diisi
        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->forceFill($data)->save();

        return redirect()->route('users.index')->with('success', 'User berhasil diubah.');
    }

    public function destroy(User $user): RedirectResponse
    {
        // admin tidak boleh menghapus akunnya sendiri
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')
                ->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }
}
