import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, User, Mail, Building, BookOpen, Trash2, RefreshCw, ExternalLink } from "lucide-react";

interface AdminUser {
  email: string;
  password: string;
  fullName: string;
  cpf: string;
  institutionalEmail: string;
  personalEmail: string;
  phone: string;
  department: string;
  registrationNumber: string;
  course: string;
}

const defaultAdmins: AdminUser[] = [
  {
    email: "thalles.24104708360068@faeterj-rio.edu.br",
    password: "admin123",
    fullName: "Thalles Costa de Souza",
    cpf: "123.456.789-00",
    institutionalEmail: "thalles.24104708360068@faeterj-rio.edu.br",
    personalEmail: "costa.thalles71@gmail.com",
    phone: "(21) 98765-4321",
    department: "Tecnologia da Informação",
    registrationNumber: "24104708360068",
    course: "CST em Sistemas de Computação",
  },
  {
    email: "costa.thalles71@gmail.com",
    password: "admin123",
    fullName: "Thalles Costa",
    cpf: "987.654.321-00",
    institutionalEmail: "costa.thalles71@gmail.com",
    personalEmail: "costa.thalles71@gmail.com",
    phone: "(21) 91234-5678",
    department: "Administração",
    registrationNumber: "202500001",
    course: "CST em Gestão de TI",
  },
];

interface Result {
  email: string;
  success: boolean;
  message: string;
}

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);

  const checkExistingUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("email, full_name, role, is_active")
      .eq("role", "admin");
    
    if (data) {
      setExistingUsers(data);
    }
  };

  const deleteExistingUsers = async () => {
    setLoading(true);
    
    try {
      // Delete profiles
      await supabase
        .from("profiles")
        .delete()
        .in("email", defaultAdmins.map(a => a.email));
      
      // Note: We can't delete from auth.users via client API
      // Users would need to be deleted manually in the dashboard
      
      setResults([{
        email: "system",
        success: true,
        message: "✅ Profiles deletados. Delete usuários no Dashboard > Authentication."
      }]);
    } catch (error) {
      setResults([{
        email: "system",
        success: false,
        message: `Erro: ${error instanceof Error ? error.message : String(error)}`
      }]);
    }
    
    setLoading(false);
  };

  const createAdminViaAPI = async (admin: AdminUser): Promise<Result> => {
    try {
      // 1. Tentar criar usuário via Auth API
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: admin.email,
        password: admin.password,
        options: {
          data: {
            full_name: admin.fullName,
          },
        },
      });

      if (authError) {
        // Se usuário já existe
        if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
          // Tentar fazer login para verificar se a senha está correta
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: admin.email,
            password: admin.password,
          });

          if (signInError) {
            return {
              email: admin.email,
              success: false,
              message: `❌ Usuário já existe mas senha "${admin.password}" está incorreta. Delete no Dashboard.`,
            };
          }

          // Senha correta, atualizar profile
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            await updateProfile(userData.user.id, admin);
            return {
              email: admin.email,
              success: true,
              message: "✅ Usuário já existia. Perfil atualizado para admin!",
            };
          }
        }

        return {
          email: admin.email,
          success: false,
          message: `❌ Erro: ${authError.message}`,
        };
      }

      if (authData.user) {
        // Criar profile completo
        await updateProfile(authData.user.id, admin);
        return {
          email: admin.email,
          success: true,
          message: "✅ Admin criado com sucesso!",
        };
      }

      return {
        email: admin.email,
        success: false,
        message: "❌ Erro desconhecido",
      };
    } catch (error) {
      return {
        email: admin.email,
        success: false,
        message: `❌ Erro: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  };

  const updateProfile = async (userId: string, admin: AdminUser) => {
    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        full_name: admin.fullName,
        cpf: admin.cpf,
        institutional_email: admin.institutionalEmail,
        personal_email: admin.personalEmail,
        phone: admin.phone,
        department: admin.department,
        registration_number: admin.registrationNumber,
        course: admin.course,
        role: "admin",
        is_active: true,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  const handleSetupAll = async () => {
    setLoading(true);
    setResults([]);
    setCurrentStep(0);

    const allResults: Result[] = [];

    for (let i = 0; i < defaultAdmins.length; i++) {
      setCurrentStep(i + 1);
      const result = await createAdminViaAPI(defaultAdmins[i]);
      allResults.push(result);
      setResults([...allResults]);
    }

    setLoading(false);
    setCurrentStep(0);
    await checkExistingUsers();
  };

  const allSuccess = results.length > 0 && results.every((r) => r.success);
  const hasErrors = results.some((r) => !r.success);

  // Check existing users on mount
  useState(() => {
    checkExistingUsers();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a4a7a] to-[#0d2f4f] py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              Setup de Administradores
            </CardTitle>
            <CardDescription className="text-lg">
              Gerencie usuários admin do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing Users */}
            {existingUsers.length > 0 && (
              <Alert className="border-yellow-500 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <p className="font-semibold">⚠️ Usuários admin já existem:</p>
                  <ul className="list-disc list-inside mt-2">
                    {existingUsers.map((user, i) => (
                      <li key={i}>{user.email} - {user.full_name}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm">
                    Se estiver com problemas de login, delete os usuários no Dashboard e crie novamente.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={deleteExistingUsers}
                disabled={loading}
                variant="destructive"
                size="lg"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar Profiles
              </Button>
              
              <Button
                onClick={handleSetupAll}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando admin {currentStep} de {defaultAdmins.length}...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Criar Ambos os Admins
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Resultados:</h3>
                {results.map((result, index) => (
                  <Alert
                    key={index}
                    className={
                      result.success
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }
                  >
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription
                      className={
                        result.success ? "text-green-800" : "text-red-800"
                      }
                    >
                      {result.message}
                    </AlertDescription>
                  </Alert>
                ))}

                {allSuccess && (
                  <Alert className="border-green-500 bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 font-semibold">
                      ✅ Todos os admins foram criados/atualizados com sucesso!
                      <br />
                      Você pode fazer login em /admin/login
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Manual Instructions */}
            <Alert className="border-blue-500 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <p className="font-semibold">📝 Se der erro "Database error saving new user":</p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Vá em <strong>Dashboard → Authentication → Users</strong></li>
                  <li>Delete os usuários existentes</li>
                  <li>Clique <strong>Add user</strong> para cada admin:</li>
                  <li className="ml-4">Email: thalles.24104708360068@faeterj-rio.edu.br | Senha: admin123</li>
                  <li className="ml-4">Email: costa.thalles71@gmail.com | Senha: admin123</li>
                  <li>Depois execute o SQL do arquivo <strong>013_update_admin_profile.sql</strong></li>
                </ol>
              </AlertDescription>
            </Alert>

            {/* Dashboard Link */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-gray-600" />
                <a 
                  href="https://app.supabase.com/project/jjsyutdikbknlnudgwsx/auth/users"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Abrir Dashboard do Supabase → Authentication → Users
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {defaultAdmins.map((admin, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Admin {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{admin.fullName}</p>
                    <p className="text-muted-foreground">{admin.cpf}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{admin.email}</p>
                    <p className="text-muted-foreground">Senha: {admin.password}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{admin.department}</p>
                    <p className="text-muted-foreground">{admin.registrationNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{admin.course}</p>
                    <p className="text-muted-foreground">{admin.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
