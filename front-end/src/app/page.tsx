import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Card className="w-[500px] h-[500px] flex">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Faça login com a sua carteira</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="cursor-pointer" >
              Conectar carteira
            </Button>
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      </main>
    </div>
  );
}
