import Button from "./Button"
import Image from "next/image"
import Link from "next/link"

export const Card = ({
  imageMeta,
  ImageComponent = null,
  title,
  description,
  actions = [],
}) => (
  <div className="flex flex-col items-center justify-between p-3 shadow-lg bg-shade rounded-2xl">
    <div className="flex items-center h-full justify-items-center">
      {imageMeta ? (
        <div className="">
          <Image
            alt={imageMeta.alt}
            src={imageMeta.src}
            width={imageMeta.width}
            height={imageMeta.height}
            objectFit="contain"
          />
        </div>
      ) : (
        ImageComponent
      )}
    </div>
    <div className="flex flex-col items-center w-full">
      <div className="text-2xl font-bold">{title}</div>
      <div className="text-base tracking-tight text-center">{description}</div>
      <CardActions actions={actions} />
    </div>
  </div>
)

export const CardActions = ({ actions }) =>
  actions.map((action, i) =>
    action.crossOrigin ? (
      <div key={`${i}-${action.href}`} className="w-full mt-5">
        <Button
          key={i}
          fullWidth
          href={action.href}
          rel="noopener noreferrer"
          target="_blank"
          label={action.text}
          dark
        />
      </div>
    ) : (
      <div key={`${i}-${action.href}`} className="w-full mt-5">
        <Link href={action.href} passHref>
          <Button fullWidth label={action.text} dark />
        </Link>
      </div>
    )
  )
