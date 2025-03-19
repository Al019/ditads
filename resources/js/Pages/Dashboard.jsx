import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FolderSync, NotebookPen, Users, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePage } from "@inertiajs/react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const Dashboard = () => {
  const { userCount, requestCount, sales } = usePage().props
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(parseFloat(amount))

  const years = Array.from({ length: currentYear - 2024 }, (_, i) => (2025 + i).toString());

  const filteredSales = sales.filter((s) => s.month.startsWith(selectedYear));

  const formattedChartData = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(selectedYear, index).toLocaleString("default", { month: "long" });
    const salesEntry = filteredSales.find((s) => s.month === `${selectedYear}-${String(index + 1).padStart(2, "0")}`);
    return {
      month,
      sales: salesEntry ? parseFloat(salesEntry.total_amount) : 0
    };
  });

  const chartConfig = {
    desktop: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <AuthenticatedLayout title="Dashboard">
      <Tabs defaultValue="survey">
        <TabsList>
          <TabsTrigger value="survey">Survey</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>
        <TabsContent value="survey">
          <div className="pt-2">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-medium text-sm">Total Enumerators</CardTitle>
                    <Users size={16} />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="font-bold text-2xl">
                    {userCount[0]}
                  </CardTitle>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-medium text-sm">Total Viewers</CardTitle>
                    <Users size={16} />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="font-bold text-2xl">
                    {userCount[1]}
                  </CardTitle>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="journal">
          <div className="pt-2 space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-medium text-sm">Total Editors</CardTitle>
                    <Users size={16} />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="font-bold text-2xl">
                    {userCount[2]}
                  </CardTitle>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-medium text-sm">Total Clients</CardTitle>
                    <Users size={16} />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="font-bold text-2xl">
                    {userCount[3]}
                  </CardTitle>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-medium text-sm">Pending Requests</CardTitle>
                    <NotebookPen size={16} />
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
                  <CardTitle>Sales Overview</CardTitle>
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
                    <Bar dataKey="sales" fill="var(--color-desktop)" radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  )
}

export default Dashboard