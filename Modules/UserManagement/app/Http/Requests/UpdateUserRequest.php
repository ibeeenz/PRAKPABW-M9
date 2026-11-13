<?php

namespace Modules\UserManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:100', Rule::unique('users', 'email')->ignore($user)],
            'role' => [
                'required',
                'in:admin,user',
                // admin tidak boleh menurunkan role akunnya sendiri
                function ($attribute, $value, $fail) use ($user) {
                    if ($user->id === $this->user()->id && $value !== $user->role) {
                        $fail('Anda tidak dapat mengubah role akun Anda sendiri.');
                    }
                },
            ],
            'password' => ['nullable', 'string', 'min:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'role.required' => 'Role wajib dipilih.',
            'role.in' => 'Role harus admin atau user.',
            'password.min' => 'Password minimal 6 karakter.',
        ];
    }
}
