<p align='center'>
<img src='https://user-images.githubusercontent.com/29555022/132058470-77a0e048-5cc9-4de5-8f39-a4965f6d9299.png' width='350' />
</p>
<p style="margin-bottom:0" align='center'>Full Stack Home Inspection App built to streamline the creation and management of home inspections
</p>

## Tech Stack

- **Reverse Proxy** — NGINX server with custom cache stores, CORS configuration, and subrequest authentication, it is used to integrate multiple services

- **Dashboard** — Created using [React](https://reactjs.org) using functional components, hooks, [MaterialUI](https://material-ui.com/), and [Socket.io](https://socket.io/). It allows users to create predefined inspection templates, manage inspections, create dynamic PDF reports, manage inspection photos (with markup, cropping), files, contacts, and emails. This dashboard features creating shareable links to share private data with clients. The UI is suitable for mobile devices. The dashboard runs on http://app.localhost

- **Public Portal** — Uses [Next.js](https://nextjs.org/) static and server side rendering. This is the portal that sits in front of the public internet and is used by clients and visitors. The portal uses server side rendering to validate shareable links shared by the inspectors via the dashboard service. The public portal runs on http://localhost

- **Backend** — Created using [Node.js](https://nodejs.org/en/) with [Express.js](https://expressjs.com/), features auth/access controls, http cookies, logging using [winston](https://github.com/winstonjs/winston), and rate limiting. This backend interacts with a postgres database using [pgpromise](http://vitaly-t.github.io/pg-promise/). It uses the [sharp](https://sharp.pixelplumbing.com/) library to optimize image loading and compression, [pdftk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/), [handlebars](https://handlebarsjs.com/) and [email-templates](https://github.com/forwardemail/email-templates) to create dynamic pdf and email templates. Postgres database queries are greatly optimized using a system of abstraction and reuse.

- **Postgres Database** - Uses full text search, access controls and support for multiple users (inspectors), and stores a wide variety of data (AWS S3 urls, Cloudfront urls, SES, SNS data).

## Important Note

This is a sandboxed demo of a slightly bigger production app currently in use.
For the purposes of a reasonable demo, this sandbox has a few limitations. It uses a single docker compose file, a single proxy server, logging, and uses localstack to mimic a subset of AWS services for offline use.

## Quickstart

Since the docker images have been pushed to the docker hub, you need only docker compose, and the following 4 files: `dev.env`, `demo`, `base.yml`, `demo.yml`.

These 4 files have been added to the `demo` branch.

```
git clone --single-branch --branch demo git@github.com:parbhatia/ptr-app-demo.git
```

```
./demo start
```

Navigate to http://app.localhost for the dashboard.

Credentials are:

```
username: demo@demo.com
password: password
```

`http://localhost` is the default public portal for the static website.

This is the server side generated link that will get sent via emails from the dashboard service: `http://localhost/Shared/${unique_shareable_link_id}`

## Screenshots

<table align="center">
    <tr>
        <tr>
            <table align="center">
                <tr width="9999" align="center">
                    <td align="center" width="50%">
                        <img src='https://user-images.githubusercontent.com/29555022/132034478-ae0653f7-e9d9-44ff-a2cf-c5df3cd2a29d.png'  />
                        <div>Dashboard</div>
                    </td>
                    <td align="center" width="50%">
                         <img src='https://user-images.githubusercontent.com/29555022/132042737-cf1751d5-36eb-4c20-85cf-67a45cd9f501.png'  />
                        <div>Page templates</div>
                    </td>
                </tr>
            </table>
        </tr>
        <tr>
            <table align="center">
                <tr width="9999" align="center">
                    <td align="center" width="50%">
                        <img src='https://user-images.githubusercontent.com/29555022/132042724-6de0e559-9adc-465f-b6d1-4d57f8698fd5.png'  />
                        <div>Customizable text store</div>
                    </td>
                    <td align="center" width="50%">
                            <img src='https://user-images.githubusercontent.com/29555022/132042736-53299526-6607-441b-906a-c946ff5980f5.png'  />
                        <div>Photo markup / crop / caption</div>
                    </td>
                </tr>
            </table>
        </tr>
        <tr>
            <table align="center">
                <tr width="9999" align="center">
                    <td align="center" width="50%">
                        <img src='https://user-images.githubusercontent.com/29555022/132042732-12e53a16-3745-45cd-9744-2e91c8c6554d.png'  />
                        <div>Dynamic PDF Report generation</div>
                    </td>
                    <td align="center" width="50%">
                        <img src='https://user-images.githubusercontent.com/29555022/132034481-3b1e734f-439d-468c-80c4-e0e5824f375b.png'  />
                        <div>Shareable link control</div>
                    </td>
                </tr>
            </table>
        </tr>
        <tr>
            <table align="center">
                <tr width="9999" align="center">
                    <td align="center" width="50%">
                        <img src='https://user-images.githubusercontent.com/29555022/132042733-b7f317dd-c596-498f-959c-8b60f8de663c.png'  />
                        <div>Email / Contact Management</div>
                    </td>
                    <td align="center" width="50%">
                        <img src='https://user-images.githubusercontent.com/29555022/132034482-ea97cc2c-74d1-4df1-8ba6-3f84e59b9c0a.png'  />
                        <div>Shareable link on public domain</div>
                    </td>
                </tr>
            </table>
        </tr>
    </tr>
</table>

## Tinkering

If you want to build the docker images yourself, you need to clone all files from the main branch.

View the instructions in the ./demo script, to edit the `BASE_YML_FILE` and `DEV_YML_FILE` parameters.

Since the backend docker image compiles libvips and libheic, it might take around 5-10 minutes.

After that, it's the same command to start.

If you decide to deviate from the ./demo script and try to `docker-compose up ...` yourself, make sure you take steps to run the `aws_init()` function, because otherwise, data won't be initialized in the localstack container.

## Personal notes

This is a project that I found to be incredible enjoyable to make. I spent a lot of time designing, and redesigning the database schema, api routes, front end ui/ux (coming from a very limited ui/ux background) and making use of computer science principles i’ve learnt over the years. I read in depth sql textbook chapters just to optimize queries that I felt could be optimized to a large degree. The concept of _reusability_ is central in this stack; specifically, it is complimented by the reuse of react components, abstracted reusable sql query functions, and in the dynamic pdf template creation that happens during runtime.

The overall structure of the inspection report, the pages, categories, checkboxes, text store, the ability to drag items where appropriate, is designed after careful analysis, real world usage, and how the data would translate to PDF. Some aspects of the software were created based primarily on specific business needs. There's alot that can be easily customized in this app to suit your needs. The end result is an app that cut down the time of everyday business tasks that took up to 2-3 hours daily, down to 10-15 minutes, and vastly streamlined communication between home inspectors with their clients.

I created this app because the home inspection software that exists in the market is convulated, has expensive subscription models, shady privacy policies, outdated ui/ux, doesn't allow contact/email management, and offers limited customization.

## Contact me

If you have any issues regarding deployment, or any feedback for this full stack app, please reach out. I would love to hear what you think.

## License

MIT License
