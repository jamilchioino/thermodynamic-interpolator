"use client"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { find } from "@/lib/find";
import { interpolate } from "@/lib/interpolate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getAirData, Row } from "./tables/air";

type State = {
  target: number,
} & Row

export default function Home() {
  const [table, setTable] = useState<State>();
  const { toast } = useToast()

  const copyToClipboard = (value: number) => {
    navigator.clipboard.writeText(value.toFixed(4).toString());
    toast({
      title: "Valor copiado",
    })
  }

  const formSchema = z.object({
    target: z.string().min(1, {
      message: "Ingresar temperatura"
    }),
    table: z.string().min(1, {
      message: "Escoge una tabla"
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      target: "",
      table: "air"
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const table = await getAirData()
    const target = +data.target
    const result = find(table, target)

    if (!result) {
      return;
    }

    if (result.length === 1) {
      setTable({ target, ...result[0] })
      return
    }

    const interpolation = interpolate(result[0], result[1], target)
    if (interpolation) {
      setTable({ target, ...interpolation })
    }
  }

  return (
    <div className="flex flex-col justify-between items-center h-screen p-2 ">
      <main className="min-w-full md:min-w-[700px] p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperatura</FormLabel>
                  <FormControl>
                    <Input placeholder="23" type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Temperatura a buscar
                  </FormDescription>
                  <FormMessage />
                </FormItem>

              )}
            />
            <FormField
              control={form.control}
              name="table"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tabla</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una tabla para usar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="air">Aire</SelectItem>
                      <SelectItem value="agua">Agua</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
            <Button type="submit">Calcular</Button>
          </form>
        </Form >
        {table && <Table>
          <TableCaption>Tabla de termodinámica</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Tipo de dato</TableHead>
              <TableHead className="w-[100px] text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow onClick={() => copyToClipboard(table.target)}>
              <TableCell>Temp. T, °C</TableCell>
              <TableCell className="text-right">{table.target}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[0])}>
              <TableCell>Presión de saturación Psat, kPa</TableCell>
              <TableCell className="text-right" >{table.data[0].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[1])}>
              <TableCell>Densidad ρ, kg/m³ Líquido</TableCell>
              <TableCell className="text-right">{table.data[1].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[2])}>
              <TableCell>Densidad ρ, kg/m³ Líquido</TableCell>
              <TableCell className="text-right">{table.data[2].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[3])}>
              <TableCell>Entalpía de vaporización hfg, kJ/kg</TableCell>
              <TableCell className="text-right">{table.data[3].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[4])}>
              <TableCell>Calor específico cp J/kg · K Líquido</TableCell>
              <TableCell className="text-right">{table.data[4].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[5])}>
              <TableCell>Calor específico cp J/kg · K Vapor </TableCell>
              <TableCell className="text-right">{table.data[5].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[6])}>
              <TableCell>Conductividad térmica k, W/m · K Líquido </TableCell>
              <TableCell className="text-right">{table.data[6].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[7])}>
              <TableCell>Conductividad térmica k, W/m · K Vapor </TableCell>
              <TableCell className="text-right">{table.data[7].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[8])}>
              <TableCell>Viscosidad dinámica μ, kg/m · s Líquido(x 10³) </TableCell>
              <TableCell className="text-right">{table.data[8].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[9])}>
              <TableCell>Viscosidad dinámica μ, kg/m · s Vapor(x 10⁵) </TableCell>
              <TableCell className="text-right">{table.data[9].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[10])}>
              <TableCell>Número de Prandtl Pr Líquido </TableCell>
              <TableCell className="text-right">{table.data[10].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[11])}>
              <TableCell>Número de Prandtl Pr Vapor </TableCell>
              <TableCell className="text-right">{table.data[11].toFixed(4)}</TableCell>
            </TableRow>
            <TableRow onClick={() => copyToClipboard(table.data[12])}>
              <TableCell> Coeficiente de expansión volumétrica β, 1/K Líquido (x 10³) </TableCell>
              <TableCell className="text-right">{table.data[12].toFixed(4)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        }
      </main >
      <footer>
        <p className="text-xs font-small text-muted-foreground">Hecho por <a href="https://github.com/jamilchioino" title="thermodynamics icons">Jamil Chioino</a>. Logo de <a href="https://www.flaticon.com/free-icon/thermodynamics_6813621" title="thermodynamics icons">Freepik - Flaticon</a> </p>
      </footer>
    </div >
  );
}
