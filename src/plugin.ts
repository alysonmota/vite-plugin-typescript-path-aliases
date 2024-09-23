import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import type {
	Alias,
	AliasOptions,
	PluginOption,
	ResolveOptions,
	ResolvedConfig,
	UserConfig,
} from 'vite'

type ResolveOptionsWithAlias = ResolveOptions & {
	alias?: AliasOptions
}

type Paths = Record<string, Array<string>>

const AliasSuffix = String.fromCharCode(0x2f).concat(String.fromCharCode(0x2a))

let userAlias: AliasOptions | undefined

export function typescriptPathAliases(): PluginOption {
	return {
		name: 'typescript-path-mapping',
		enforce: 'pre',
		apply: 'serve',
		async configResolved({ root }: ResolvedConfig) {
			const paths = new Object() as Paths

			if (Array.isArray(userAlias)) {
				for (const map of userAlias as Readonly<Array<Alias>>) {
					const { find, replacement } = map
					if (find instanceof RegExp) continue
					paths[find.concat(AliasSuffix)] = new Array<string>(
						replacement.concat(AliasSuffix),
					)
				}
				writeFileSync(
					join(root, 'paths.json'),
					JSON.stringify({ compilerOptions: { paths } }),
				)
			}
		},
		config(config: UserConfig) {
			const { resolve } = config
			const { alias } = new Object(resolve) as ResolveOptionsWithAlias
			userAlias = alias
		},
	}
}
