"use client";

import {
  CategoryScale,
  ChartDataset,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  Title,
  Tooltip,
} from "chart.js";
import { RocketIcon } from "lucide-react";
import { Fragment, useLayoutEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import { formatMinimalBrainsToSelectComponentInput } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/utils/formatMinimalBrainsToSelectComponentInput";
import Spinner from "@/components/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Range } from "@/lib/api/analytics/types";
import { useAnalytics } from "@/lib/api/analytics/useAnalyticsApi";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useDevice } from "@/lib/hooks/useDevice";

ChartJS.register(
  CategoryScale,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics(): JSX.Element {
  const { isMobile } = useDevice();
  const { getBrainsUsages } = useAnalytics();
  const { allBrains } = useBrainContext();
  const [chartData, setChartData] = useState({
    labels: [] as Date[],
    datasets: [{}] as ChartDataset<"line", number[]>[],
  });
  const [currentChartRange, setCurrentChartRange] = useState(
    Range.WEEK as number
  );
  const [selectedBrainId, setSelectedBrainId] = useState<string | null>(null);

  const graphRangeOptions = [
    { label: "Last 7 days", value: Range.WEEK },
    { label: "Last 30 days", value: Range.MONTH },
    { label: "Last 90 days", value: Range.QUARTER },
  ];

  const brainsWithUploadRights =
    formatMinimalBrainsToSelectComponentInput(allBrains);

  const selectedGraphRangeOption = graphRangeOptions.find(
    (option) => option.value === currentChartRange
  );

  const handleGraphRangeChange = (newValue: number) => {
    setCurrentChartRange(newValue);
  };

  useLayoutEffect(() => {
    void (async () => {
      try {
        const res = await getBrainsUsages(selectedBrainId, currentChartRange);
        const chartLabels = res?.usages.map((usage) => usage.date) as Date[];
        const chartDataset = res?.usages.map(
          (usage) => usage.usage_count
        ) as number[];

        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: `Daily questions to ${
                selectedBrainId
                  ? allBrains.find((brain) => brain.id === selectedBrainId)
                      ?.name
                  : "your brains"
              }`,
              data: chartDataset,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: (context: ScriptableContext<"line">) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(100, 100, 100, 250);
                gradient.addColorStop(0, "rgba(75, 192, 192, 0.4)");
                gradient.addColorStop(1, "rgba(75, 192, 192, 0.05)");

                return gradient;
              },
              fill: true,
              tension: 0.2,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [chartData.labels.length, currentChartRange, selectedBrainId]);

  const options = {
    type: "line",
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="flex flex-col">
      {!isMobile ? (
        <div>
          {chartData.labels.length ? (
            <Fragment>
              <div className="flex justify-between">
                <div className="w-full max-w-[300px]">
                  <Select
                    name="range"
                    onValueChange={(e) => handleGraphRangeChange(Number(e))}
                    defaultValue={
                      selectedGraphRangeOption?.value.toString() ?? undefined
                    }
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select a specific range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Range list</SelectLabel>
                        {graphRangeOptions.map((brain) => (
                          <SelectItem
                            key={brain.value.toString()}
                            value={brain.value.toString()}
                          >
                            {brain.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full max-w-[300px]">
                  <Select
                    name="brain"
                    onValueChange={(e) => setSelectedBrainId(e)}
                    defaultValue={selectedBrainId ?? undefined}
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select a specific brain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Brains list</SelectLabel>
                        {brainsWithUploadRights.map((brain) => (
                          <SelectItem key={brain.value} value={brain.value}>
                            {brain.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Line data={chartData} options={options} />
            </Fragment>
          ) : (
            <Spinner />
          )}
        </div>
      ) : (
        <Alert>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            <span className="flex items-center">
              This feature is not available on small screens.
            </span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
