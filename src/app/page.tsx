"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { find } from "@/lib/find"
import { interpolate } from "@/lib/interpolate"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useTransition, animated } from "react-spring"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getThermodynamicTable, Row, TableType } from "./tables/thermodynamics"

type State = {
  titles: string[],
  target: number
} & Row

export default function Home() {
  const [table, setTable] = useState<State>()
  const { toast } = useToast()

  const transitions = useTransition(table, {
    from: {
      opacity: 0,
    },
    leave: {
      opacity: 1,
    },
    enter: {
      opacity: 1,
    },
    exitBeforeEnter: true,
  })

  const copyToClipboard = (value: number | null) => {
    if (!value) {
      return
    }
    navigator.clipboard.writeText(value.toFixed(4).toString())
    toast({
      title: "Valor copiado",
    })
  }

  const formSchema = z.object({
    target: z.string().min(1, {
      message: "Ingresar temperatura",
    }),
    table: z.string().min(1, {
      message: "Escoge una tabla",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      target: "",
      table: "air",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const table = await getThermodynamicTable(data.table as TableType)
    const target = +data.target
    const result = find(table.rows, target)

    if (!result) {
      return
    }

    if (result.length === 1) {
      setTable({ titles: table.titles, target, ...result[0] })
      return
    }

    const interpolation = interpolate(result[0], result[1], target)
    if (interpolation) {
      setTable({ titles: table.titles, target, ...interpolation })
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-between p-2">
      <main className="min-w-full p-8 md:min-w-[700px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mb-8 space-y-6"
          >
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperatura</FormLabel>
                  <FormControl>
                    <Input placeholder="23" type="number" {...field} />
                  </FormControl>
                  <FormDescription>Temperatura a buscar</FormDescription>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una tabla para usar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="air">Aire</SelectItem>
                      <SelectItem value="water">Agua</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button type="submit">Calcular</Button>
          </form>
        </Form>
        {transitions(
          (style, table) =>
            table && (
              <animated.div style={style}>
                <Table>
                  <TableCaption>Tabla de termodinámica</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Tipo de dato</TableHead>
                      <TableHead className="w-[100px] text-right">
                        Valor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow onClick={() => copyToClipboard(table.target)}>
                      <TableCell>Temp. T, °C</TableCell>
                      <TableCell className="text-right">
                        {table.target}
                      </TableCell>
                    </TableRow>
                    {table.data.map((data, index) => (
                      <TableRow
                        key={index}
                        onClick={() => copyToClipboard(table.data[index])}
                      >
                        <TableCell>{table.titles[index+1]}</TableCell>
                        <TableCell className="text-right">
                          {data === null
                            ? "NA"
                            : data.toFixed(4)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </animated.div>
            ),
        )}
      </main>
      <footer>
        <p className="font-small text-xs text-muted-foreground">
          Hecho por{" "}
          <a
            href="https://github.com/jamilchioino"
            title="thermodynamics icons"
          >
            Jamil Chioino
          </a>
          . Logo de{" "}
          <a
            href="https://www.flaticon.com/free-icon/thermodynamics_6813621"
            title="thermodynamics icons"
          >
            Freepik - Flaticon
          </a>{" "}
        </p>
      </footer>
    </div>
  )
}
