import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import { usePage } from "@inertiajs/react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { useState } from "react"

const Dashboard = () => {
  const { requests, published } = usePage().props
  const currentYear = new Date().getFullYear().toString();
  const [requestYear, setRequestYear] = useState(currentYear);
  const [publishedYear, setPublishedYear] = useState(currentYear);
  const years = Array.from({ length: currentYear - 2024 }, (_, i) => (2025 + i).toString());

  const filteredRequests = requests.filter((r) => r.month.startsWith(requestYear));
  const formattedRequestData = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(requestYear, index).toLocaleString("default", { month: "long" });
    const requestEntry = filteredRequests.find((r) => r.month === `${requestYear}-${String(index + 1).padStart(2, "0")}`);
    return {
      month,
      requests: requestEntry ? parseInt(requestEntry.total_requests, 10) : 0
    };
  });

  const filteredPublished = published.filter((r) => r.month.startsWith(publishedYear));
  const formattedPublishedData = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(publishedYear, index).toLocaleString("default", { month: "long" });
    const publishedEntry = filteredPublished.find((r) => r.month === `${publishedYear}-${String(index + 1).padStart(2, "0")}`);
    return {
      month,
      published: publishedEntry ? parseInt(publishedEntry.total_published, 10) : 0
    };
  });

  const chartConfig = {
    requests: {
      label: "Requests",
      color: "hsl(var(--chart-2))",
    },
    published: {
      label: "Published",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>Requests Overview</CardTitle>
            <CardDescription>
              Total: {filteredRequests.reduce((sum, r) => sum + parseInt(r.total_requests, 10), 0)}
            </CardDescription>
          </CardHeader>
          <CardHeader>
            <Select value={requestYear} onValueChange={setRequestYear}>
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
            <BarChart accessibilityLayer data={formattedRequestData}>
              <CartesianGrid vertical={false} />
              <YAxis tickLine={false} axisLine={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="requests" fill="var(--color-requests)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>Published Overview</CardTitle>
            <CardDescription>
              Total: {filteredPublished.reduce((sum, r) => sum + parseInt(r.total_published, 10), 0)}
            </CardDescription>
          </CardHeader>
          <CardHeader>
            <Select value={publishedYear} onValueChange={setPublishedYear}>
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
            <BarChart accessibilityLayer data={formattedPublishedData}>
              <CartesianGrid vertical={false} />
              <YAxis tickLine={false} axisLine={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="published" fill="var(--color-published)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

Dashboard.layout = page => <AuthenticatedLayout children={page} title="Dashboard" />

export default Dashboard