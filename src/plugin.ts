import { writeFileSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'

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

const Slash = String.fromCharCode(0x2f)
const AliasSuffix = Slash.concat(String.fromCharCode(0x2a))
const Dot = String.fromCharCode(0x2e)
const RelativePrefix = Dot.concat(Slash)

let userAlias: AliasOptions | undefined

function formatRelativePath(path: string): string {
	if (path.startsWith(RelativePrefix)) return path
	if (path.startsWith(Slash)) return Dot.concat(path)
	return RelativePrefix.concat(path)
}

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
					const _isAbsolute = isAbsolute(replacement)
					const alias = formatRelativePath(
						_isAbsolute ? replacement.replace(root, String()) : replacement,
					)
					paths[find.concat(AliasSuffix)] = new Array<string>(
						alias.concat(AliasSuffix),
					)
				}
				writeFileSync(
					join(
						root,
						'node_modules/vite-plugin-typescript-path-aliases/paths.json',
					),
					JSON.stringify({ compilerOptions: { baseUrl: root, paths } }),
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
