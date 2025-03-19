import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { usePage } from "@inertiajs/react"
import { FileInput, FolderSync } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Dashboard = () => {
  const { requestCount, commissions } = usePage().props
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(parseFloat(amount))

  const years = Array.from({ length: currentYear - 2024 }, (_, i) => (2025 + i).toString());

  const filteredCommissions = commissions.filter((s) => s.month.startsWith(selectedYear));

  const formattedChartData = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(selectedYear, index).toLocaleString("default", { month: "long" });
    const commissionEntry = filteredCommissions.find((s) => s.month === `${selectedYear}-${String(index + 1).padStart(2, "0")}`);
    return {
      month,
      commissions: commissionEntry ? parseFloat(commissionEntry.total_amount) : 0
    };
  });

  const chartConfig = {
    desktop: {
      label: "Commissions",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <AuthenticatedLayout title="Dashboard">
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-medium text-sm">Pending Assign Documents</CardTitle>
                <FileInput size={16} />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="font-bold text-2xl">
                {requestCount[0]}
              </CardTitle>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-medium text-sm">Published Documents</CardTitle>
                <FolderSync size={16} />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="font-bold text-2xl">
                {requestCount[1]}
              </CardTitle>
            </CardContent>
          </Card>
        </div>
        <Card>
          <div className="flex items-center justify-between">
            <CardHeader>
              <CardTitle>Commissions Overview</CardTitle>
            </CardHeader>
            <CardHeader>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
          </div>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={formattedChartData}>
                <CartesianGrid vertical={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="commissions" fill="var(--color-desktop)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}

export default Dashboard