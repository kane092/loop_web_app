import { ReactNode } from "react"
import { helpers, ChartPoint, ChartOptions } from "chart.js"
import { Line, defaults, Bar } from "react-chartjs-2"
import { format as formatDate } from "date-fns"
import {commas, decimal, format} from "../libs/parse"
import Change from "../components/Change"
import styles from "./ChartContainer.module.scss"

/* styles */
const $font = '"Lexend", sans-serif'
const $darkblue = "#172240"
const $aqua = "#01CDFD"
const $size = 14
// const $red = "#e64c57"
const $slate = "#505466"
// const $text = "rgba(1, 205, 253, 1)"
const $green = "rgb(140,253,10)"
const $light_bg = "rgba(1, 205, 253, 0.2)"
const $line = helpers.color($slate).alpha(0.2).rgbString()
var $bg_transparent = "transparent"

defaults.global.defaultFontColor = $slate
defaults.global.defaultFontFamily = $font
defaults.global.defaultFontSize = $size

interface Props {
  multiAxes?: boolean
  value?: ReactNode
  change?: string
  datasets: ChartPoint[]
  fmt?: { t: string }
  compact?: boolean
  bar?: boolean
  symbol?: string
}

const ChartContainer = ({
  multiAxes,
  value,
  symbol,
  change,
  datasets,
  ...props
}: Props) => {
  const { fmt, compact, bar } = props

  // const borderColor =
  //   (change && (gt(change, 0) ? $aqua : lt(change, 0) && $red)) || $text

  const height = compact ? 120 : 300

  const data: any = (canvas: any) => {
    const ctx = canvas.getContext("2d")
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, $light_bg)
    gradient.addColorStop(1, $bg_transparent)

    const border = ctx.createLinearGradient(0, 0, 0, height)
    border.addColorStop(1, $aqua)
    border.addColorStop(0, $green)

    return {
      datasets: [
        {
          fill: true,
          borderColor: border,
          borderCapStyle: "round",
          borderWidth: 2,
          lineTension: compact ? 0.2 : 0.05,
          pointRadius: 0,
          pointHoverRadius: 0,
          data: datasets,
          backgroundColor: gradient,
        },
      ],
    }
  }

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    legend: { display: false },
    layout: compact ? { padding: 20 } : undefined,
    scales: {
      xAxes: [
        {
          offset: true,
          type: "time",
          time: {
            parser: "dd LLL HH:mm",
            unit: "hour",
            unitStepSize: 1,
            displayFormats: {
              hour: "DD MMM",
            },
          },
          display: !compact,
          ticks: {
            source: "data",
            autoSkip: true,
            autoSkipPadding: 15,
            maxRotation: 0,
          },
          gridLines: {
            drawBorder: true,
            color: $line,
            zeroLineColor: $line,
            borderDash: [10, 10],
          },
        },
      ],
      yAxes: [
        {
          display: !compact,
          position: "left",
          gridLines: {
            drawBorder: true,
            color: $line,
            zeroLineColor: $line,
            borderDash: [10, 10],
          },
          ticks: {
            callback: (value) => format(value as string),
            padding: 20,
          },
        },
      ],
    },
    tooltips: {
      mode: "index",
      intersect: false,
      displayColors: false,
      backgroundColor: "white",
      cornerRadius: 5,
      titleFontColor: $darkblue,
      titleFontSize: 16,
      titleFontStyle: "600",
      bodyFontColor: $darkblue,
      bodyFontSize: 12,
      xPadding: 10,
      yPadding: 8,
      callbacks: {
        title: ([{ value }]) =>
          value ? `${commas(decimal(value, 4))} ${symbol ?? ""}` : "",
        label: ({ label }) =>
          label
            ? fmt
              ? formatDate(new Date(label), fmt.t)
              : new Date(label).toDateString()
            : "",
      },
    },
  }

  const chartProps = { height, data, options }

  return (
    <article>
      {value && (
        <header className={styles.header}>
          <strong className={styles.value}>{value}</strong>
          <Change className={styles.change}>{change}</Change>
        </header>
      )}

      {datasets.length > 1 && (
        <section className={styles.chart}>
          {bar ? (
            <Bar {...chartProps} data={chartProps.data} redraw />
          ) : multiAxes ? 
          ( <Line {...chartProps} data={chartProps.data} redraw /> )
          :(
            <Line {...chartProps} data={chartProps.data} redraw />
          )}
        </section>
      )}
    </article>
  )
}

export default ChartContainer
